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
exports.ClubService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
const gamification_service_1 = require("../gamification/gamification.service");
let ClubService = class ClubService {
    prisma;
    notificationService;
    gamificationService;
    constructor(prisma, notificationService, gamificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
        this.gamificationService = gamificationService;
    }
    async create(creatorId, data) {
        return this.prisma.club.create({
            data: {
                name: data.name,
                description: data.description,
                city: data.city,
                isPrivate: data.isPrivate || false,
                creator: { connect: { id: creatorId } },
                members: {
                    create: [{ userId: creatorId, role: 'ADMIN' }]
                }
            }
        });
    }
    async findAll() {
        return this.prisma.club.findMany({
            include: { _count: { select: { members: true } } }
        });
    }
    async findOne(id) {
        const club = await this.prisma.club.findUnique({
            where: { id },
            include: {
                members: { include: { user: true } },
                events: true,
                _count: { select: { members: true, posts: true } }
            }
        });
        if (!club)
            throw new common_1.NotFoundException('Club not found');
        return club;
    }
    async createInvite(clubId) {
        const token = Math.random().toString(36).substring(2, 15);
        return this.prisma.clubInvite.create({
            data: {
                token,
                clubId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
    }
    async joinViaInvite(userId, token) {
        const invite = await this.prisma.clubInvite.findUnique({
            where: { token },
            include: { club: true }
        });
        if (!invite || (invite.expiresAt && invite.expiresAt < new Date())) {
            throw new common_1.BadRequestException('Invalid or expired invite');
        }
        return this.prisma.clubMember.create({
            data: {
                userId,
                clubId: invite.clubId,
                role: 'MEMBER'
            }
        });
    }
    async requestToJoin(userId, clubId) {
        const club = await this.findOne(clubId);
        if (!club.isPrivate) {
            return this.prisma.clubMember.create({
                data: { userId, clubId, role: 'MEMBER' }
            });
        }
        const request = await this.prisma.clubJoinRequest.create({
            data: { userId, clubId }
        });
        await this.notificationService.notifyUser(club.creatorId, 'INVITE', `Novo pedido de entrada no clube "${club.name}"`);
        return request;
    }
    async handleJoinRequest(operatorId, requestId, status) {
        const request = await this.prisma.clubJoinRequest.findUnique({
            where: { id: requestId },
            include: { club: true }
        });
        if (!request)
            throw new common_1.NotFoundException('Request not found');
        const membership = await this.prisma.clubMember.findUnique({
            where: { clubId_userId: { clubId: request.clubId, userId: operatorId } }
        });
        if (!membership || (membership.role !== 'ADMIN' && membership.role !== 'MODERATOR')) {
            throw new common_1.BadRequestException('Unauthorized');
        }
        if (status === 'APPROVED') {
            await this.prisma.clubMember.create({
                data: { userId: request.userId, clubId: request.clubId, role: 'MEMBER' }
            });
        }
        return this.prisma.clubJoinRequest.update({
            where: { id: requestId },
            data: { status }
        });
    }
    async createPost(userId, content, clubId) {
        if (clubId) {
            const membership = await this.prisma.clubMember.findUnique({
                where: { clubId_userId: { clubId, userId } }
            });
            if (!membership)
                throw new common_1.BadRequestException('Must be a member of the club to post there');
        }
        const post = await this.prisma.clubPost.create({
            data: { content, clubId, authorId: userId }
        });
        await this.gamificationService.addPoints(userId, 10, clubId ? 'Publicou uma discussão no clube' : 'Fez uma postagem no feed global');
        return post;
    }
    async getFeed(clubId) {
        return this.prisma.clubPost.findMany({
            where: { clubId },
            include: { author: { select: { username: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }
    async getGlobalFeed() {
        return this.prisma.clubPost.findMany({
            where: {
                OR: [
                    { clubId: null },
                    { club: { isPrivate: false } }
                ]
            },
            include: {
                author: { select: { username: true, avatar: true } },
                club: { select: { name: true, id: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }
};
exports.ClubService = ClubService;
exports.ClubService = ClubService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService,
        gamification_service_1.GamificationService])
], ClubService);
//# sourceMappingURL=club.service.js.map