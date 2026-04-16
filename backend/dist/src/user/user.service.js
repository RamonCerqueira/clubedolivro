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
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
        return this.prisma.user.update({
            where: { id: followerId },
            data: {
                following: {
                    connect: { id: followingId },
                },
            },
        });
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
    async getProfile(id) {
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
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { password, ...safeUser } = user;
        return safeUser;
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
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map