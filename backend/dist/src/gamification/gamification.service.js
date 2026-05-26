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
var GamificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
const BADGE_DEFINITIONS = [
    {
        type: 'FIRST_POST',
        title: '✍️ Primeiro Post',
        condition: async (prisma, userId) => {
            const count = await prisma.clubPost.count({ where: { authorId: userId } });
            return { unlocked: count >= 1, progress: Math.min(count, 1), target: 1 };
        },
    },
    {
        type: 'SOCIAL_BUTTERFLY',
        title: '🦋 Borboleta Social',
        condition: async (prisma, userId) => {
            const count = await prisma.clubPost.count({ where: { authorId: userId } });
            return { unlocked: count >= 10, progress: Math.min(count, 10), target: 10 };
        },
    },
    {
        type: 'CLUB_EXPLORER',
        title: '🏛️ Explorador de Clubes',
        condition: async (prisma, userId) => {
            const count = await prisma.clubMember.count({ where: { userId } });
            return { unlocked: count >= 3, progress: Math.min(count, 3), target: 3 };
        },
    },
    {
        type: 'EVENT_ORGANIZER',
        title: '🎪 Organizador de Eventos',
        condition: async (prisma, userId) => {
            const count = await prisma.event.count({ where: { organizerId: userId } });
            return { unlocked: count >= 1, progress: Math.min(count, 1), target: 1 };
        },
    },
    {
        type: 'AVID_READER',
        title: '📚 Leitor Ávido',
        condition: async (prisma, userId) => {
            const journals = await prisma.readingJournal.aggregate({
                where: { userId },
                _sum: { pagesRead: true },
            });
            const total = journals._sum.pagesRead || 0;
            return { unlocked: total >= 100, progress: Math.min(total, 100), target: 100 };
        },
    },
    {
        type: 'STREAK_MASTER',
        title: '🔥 Mestre do Streak',
        condition: async (prisma, userId) => {
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { streak: true } });
            const streak = user?.streak || 0;
            return { unlocked: streak >= 7, progress: Math.min(streak, 7), target: 7 };
        },
    },
    {
        type: 'LEVEL_5',
        title: '⭐ Leitor Experiente',
        condition: async (prisma, userId) => {
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { level: true } });
            const level = user?.level || 1;
            return { unlocked: level >= 5, progress: Math.min(level, 5), target: 5 };
        },
    },
    {
        type: 'FIRST_FOLLOWER',
        title: '👥 Primeiro Seguidor',
        condition: async (prisma, userId) => {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { _count: { select: { followedBy: true } } },
            });
            const count = user?._count?.followedBy || 0;
            return { unlocked: count >= 1, progress: Math.min(count, 1), target: 1 };
        },
    },
];
let GamificationService = GamificationService_1 = class GamificationService {
    prisma;
    notificationService;
    logger = new common_1.Logger(GamificationService_1.name);
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async addPoints(userId, points, reason) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            this.logger.warn(`Failed to add points: User with ID ${userId} not found.`);
            return;
        }
        const newPoints = user.points + points;
        const newLevel = Math.floor(newPoints / 100) + 1;
        this.logger.log(`Adding ${points} points to user ${user.username} (ID: ${userId}). Reason: "${reason}". ${user.points} -> ${newPoints}.`);
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                points: newPoints,
                level: newLevel,
                lastActivityAt: new Date(),
            },
        });
        if (newLevel > user.level) {
            this.logger.log(`User ${user.username} leveled up: ${user.level} -> ${newLevel}!`);
            await this.notificationService.notifyUser(userId, 'RANK', `🎉 Parabéns! Você alcançou o nível ${newLevel}! Continue lendo!`);
        }
        await this.checkAndAwardBadges(userId);
        return updatedUser;
    }
    async updateStreak(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const now = new Date();
        const lastActivity = new Date(user.lastActivityAt);
        const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
        let newStreak = user.streak;
        if (diffHours > 24 && diffHours < 48) {
            newStreak += 1;
        }
        else if (diffHours >= 48) {
            newStreak = 1;
        }
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                streak: newStreak,
                lastActivityAt: now,
            },
        });
        await this.checkAndAwardBadges(userId);
        return updated;
    }
    async checkAndAwardBadges(userId) {
        for (const badge of BADGE_DEFINITIONS) {
            try {
                const { unlocked, progress, target } = await badge.condition(this.prisma, userId);
                const existing = await this.prisma.achievement.findFirst({
                    where: { userId, type: badge.type },
                });
                if (existing) {
                    await this.prisma.achievement.update({
                        where: { id: existing.id },
                        data: { progress },
                    });
                }
                else {
                    await this.prisma.achievement.create({
                        data: {
                            type: badge.type,
                            title: badge.title,
                            progress,
                            target,
                            userId,
                        },
                    });
                    if (unlocked) {
                        await this.notificationService.notifyUser(userId, 'RANK', `🏆 Conquista desbloqueada: "${badge.title}"!`);
                        this.logger.log(`Badge "${badge.type}" awarded to user ${userId}`);
                    }
                }
                if (existing && !existing.progress && progress >= target) {
                    await this.notificationService.notifyUser(userId, 'RANK', `🏆 Conquista desbloqueada: "${badge.title}"!`);
                }
            }
            catch (err) {
                this.logger.error(`Error checking badge ${badge.type} for user ${userId}:`, err);
            }
        }
    }
    async getGlobalRanking() {
        return this.prisma.user.findMany({
            orderBy: { points: 'desc' },
            take: 10,
            select: {
                username: true,
                avatar: true,
                level: true,
                points: true,
                streak: true,
                achievements: {
                    select: { type: true, title: true },
                },
            },
        });
    }
    async getUserStats(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                level: true,
                points: true,
                streak: true,
                achievements: true,
                _count: {
                    select: {
                        posts: true,
                        memberships: true,
                        organizedEvents: true,
                        journals: true,
                    },
                },
            },
        });
        return user;
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = GamificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map