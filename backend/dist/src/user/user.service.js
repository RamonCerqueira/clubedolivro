"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
let UserService = class UserService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async create(data) {
        return this.prisma.user.create({ data });
    }
    async update(id, data) {
        return this.prisma.user.update({ where: { id }, data });
    }
    async followUser(followerId, followingId) {
        if (followerId === followingId)
            throw new Error('Cannot follow yourself');
        const updatedFollower = await this.prisma.user.update({
            where: { id: followerId },
            data: {
                following: {
                    connect: { id: followingId },
                },
            },
        });
        const followerUser = await this.prisma.user.findUnique({
            where: { id: followerId },
            select: { username: true }
        });
        const followedUser = await this.prisma.user.findUnique({
            where: { id: followingId },
            select: { username: true }
        });
        const isMutual = await this.prisma.user.findFirst({
            where: {
                id: followingId,
                following: {
                    some: {
                        id: followerId
                    }
                }
            }
        });
        if (isMutual) {
            await this.notificationService.notifyUser(followingId, 'INVITE', `✨ Você e ${followerUser?.username} agora são amigos mútuos!`).catch(e => console.error('Failed to notify follow', e));
            await this.notificationService.notifyUser(followerId, 'INVITE', `✨ Você e ${followedUser?.username} agora são amigos mútuos!`).catch(e => console.error('Failed to notify follow', e));
        }
        else {
            await this.notificationService.notifyUser(followingId, 'INVITE', `👤 ${followerUser?.username} começou a te seguir!`).catch(e => console.error('Failed to notify follow', e));
        }
        return updatedFollower;
    }
    async unfollowUser(followerId, followingId) {
        return this.prisma.user.update({
            where: { id: followerId },
            data: {
                following: {
                    disconnect: { id: followingId },
                },
            },
        });
    }
    async updateInterests(id, interests) {
        return this.prisma.user.update({
            where: { id },
            data: { interests },
        });
    }
    async getProfile(id, viewerId) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        following: true,
                        followedBy: true,
                        memberships: true,
                        organizedEvents: true,
                        rsvps: true,
                    },
                },
                memberships: {
                    include: { club: true },
                    take: 5,
                },
                achievements: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        let isFollowing = false;
        let isFollowedBy = false;
        if (viewerId && viewerId !== id) {
            const followCheck = await this.prisma.user.findUnique({
                where: { id: viewerId },
                select: {
                    following: { where: { id } },
                    followedBy: { where: { id } }
                }
            });
            isFollowing = (followCheck?.following?.length ?? 0) > 0;
            isFollowedBy = (followCheck?.followedBy?.length ?? 0) > 0;
        }
        const { password, ...safeUser } = user;
        return { ...safeUser, isFollowing, isFollowedBy };
    }
    async getFollowing(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar: true,
                        bio: true,
                        level: true,
                    }
                }
            }
        });
        return user?.following || [];
    }
    async getFollowers(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                followedBy: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar: true,
                        bio: true,
                        level: true,
                    }
                }
            }
        });
        return user?.followedBy || [];
    }
    async searchUsers(query) {
        return this.prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { bio: { contains: query, mode: 'insensitive' } },
                ]
            },
            select: {
                id: true,
                username: true,
                avatar: true,
                bio: true,
                level: true,
            },
            take: 20
        });
    }
    async getUserStatistics(id) {
        const journals = await this.prisma.readingJournal.findMany({
            where: { userId: id },
            select: { pagesRead: true }
        });
        const totalPagesRead = journals.reduce((acc, curr) => acc + curr.pagesRead, 0);
        const readBooks = await this.prisma.readingListItem.findMany({
            where: { list: { userId: id, type: 'READ' } },
            include: { book: true }
        });
        const booksReadCount = readBooks.length;
        const categoriesCount = {};
        readBooks.forEach(item => {
            item.book.categories.forEach(cat => {
                categoriesCount[cat] = (categoriesCount[cat] || 0) + 1;
            });
        });
        const favoriteCategories = Object.entries(categoriesCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);
        return { totalPagesRead, booksReadCount, favoriteCategories };
    }
    async getRecommendations(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { interests: true, following: { select: { id: true } } }
        });
        if (!user)
            return [];
        const followingIds = user.following.map(f => f.id);
        followingIds.push(userId);
        return this.prisma.user.findMany({
            where: { id: { notIn: followingIds }, interests: { hasSome: user.interests } },
            select: { id: true, username: true, avatar: true, bio: true, interests: true },
            take: 10
        });
    }
    async getUserActivity(id) {
        const posts = await this.prisma.clubPost.findMany({
            where: { authorId: id },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { club: { select: { name: true } } }
        });
        const rsvps = await this.prisma.eventRsvp.findMany({
            where: { userId: id },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { event: { select: { title: true, date: true } } }
        });
        const readingListItems = await this.prisma.readingListItem.findMany({
            where: { list: { userId: id } },
            orderBy: { addedAt: 'desc' },
            take: 10,
            include: { book: { select: { title: true, author: true } }, list: { select: { type: true } } }
        });
        const journals = await this.prisma.readingJournal.findMany({
            where: { userId: id },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        const activity = [
            ...posts.map(p => ({ type: 'POST', date: p.createdAt, data: p })),
            ...rsvps.map(r => ({ type: 'RSVP', date: r.createdAt, data: r })),
            ...readingListItems.map(r => ({ type: 'READING_LIST', date: r.addedAt, data: r })),
            ...journals.map(j => ({ type: 'JOURNAL', date: j.createdAt, data: j }))
        ];
        return activity.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 20);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], UserService);
//# sourceMappingURL=user.service.js.map