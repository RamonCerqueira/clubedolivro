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
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
let GamificationService = class GamificationService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async addPoints(userId, points, reason) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return;
        const newPoints = user.points + points;
        const newLevel = Math.floor(newPoints / 100) + 1;
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                points: newPoints,
                level: newLevel,
                lastActivityAt: new Date(),
            },
        });
        if (newLevel > user.level) {
            await this.notificationService.notifyUser(userId, 'RANK', `Parabéns! Você alcançou o nível ${newLevel}!`);
        }
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
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                streak: newStreak,
                lastActivityAt: now,
            },
        });
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
            },
        });
    }
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map