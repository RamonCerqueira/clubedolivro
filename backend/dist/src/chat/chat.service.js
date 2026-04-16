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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveMessage(userId, content, clubId, eventId, receiverId) {
        return this.prisma.message.create({
            data: {
                content,
                userId,
                clubId,
                eventId,
                receiverId,
            },
            include: { user: { select: { username: true, avatar: true } } },
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map