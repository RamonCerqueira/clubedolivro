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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notification_service_1 = require("../notification/notification.service");
let ChatService = class ChatService {
    prisma;
    notificationService;
    constructor(prisma, notificationService) {
        this.prisma = prisma;
        this.notificationService = notificationService;
    }
    async saveMessage(userId, content, clubId, eventId, receiverId) {
        const message = await this.prisma.message.create({
            data: {
                content,
                userId,
                clubId,
                eventId,
                receiverId,
            },
            include: { user: { select: { username: true, avatar: true } } },
        });
        if (receiverId) {
            await this.notificationService.notifyUser(receiverId, 'MESSAGE', `💬 ${message.user.username}: ${content.substring(0, 40)}${content.length > 40 ? '...' : ''}`).catch(e => console.error('Failed to notify message', e));
        }
        return message;
    }
    async getMessages(clubId, eventId, userId, receiverId) {
        if (userId && receiverId) {
            return this.prisma.message.findMany({
                where: {
                    OR: [
                        { userId: userId, receiverId: receiverId },
                        { userId: receiverId, receiverId: userId },
                    ]
                },
                include: { user: { select: { username: true, avatar: true } } },
                orderBy: { createdAt: 'asc' },
                take: 100,
            });
        }
        return this.prisma.message.findMany({
            where: { clubId, eventId },
            include: { user: { select: { username: true, avatar: true } } },
            orderBy: { createdAt: 'asc' },
            take: 50,
        });
    }
    async createDiscussion(userId, bookId, content, chapter) {
        return this.prisma.bookDiscussion.create({
            data: { content, bookId, authorId: userId, chapter },
            include: { author: { select: { username: true, avatar: true } } },
        });
    }
    async getDiscussions(bookId) {
        return this.prisma.bookDiscussion.findMany({
            where: { bookId },
            include: { author: { select: { username: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_service_1.NotificationService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notification_service_1.NotificationService])
], ChatService);
//# sourceMappingURL=chat.service.js.map