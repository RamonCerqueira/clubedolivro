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
exports.JournalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const club_service_1 = require("../club/club.service");
let JournalService = class JournalService {
    prisma;
    clubService;
    constructor(prisma, clubService) {
        this.prisma = prisma;
        this.clubService = clubService;
    }
    async create(userId, data) {
        const journal = await this.prisma.readingJournal.create({
            data: {
                userId,
                bookTitle: data.bookTitle,
                author: data.author,
                pagesRead: data.pagesRead,
                feelings: data.feelings,
                notes: data.notes,
                mediaUrl: data.mediaUrl,
                mediaType: data.mediaType,
            },
        });
        if (data.postToFeed) {
            let feedContent = `📖 Diário de Bordo: Li ${data.pagesRead} páginas de "${data.bookTitle}"${data.author ? ` (${data.author})` : ''}!\n\n`;
            if (data.feelings && data.feelings.length > 0) {
                feedContent += `✨ Sentimentos: ${data.feelings.join(', ')}\n`;
            }
            if (data.notes) {
                feedContent += `📝 Anotações: ${data.notes}`;
            }
            await this.clubService.createPost(userId, feedContent, undefined, undefined, data.mediaUrl, data.mediaType).catch(e => console.error('Failed to auto-post journal to feed', e));
        }
        const earnedPoints = data.pagesRead * 2;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { points: true, level: true },
        });
        if (user) {
            const newPoints = user.points + earnedPoints;
            let newLevel = user.level;
            let pointsToNextLevel = newLevel * 100;
            let tempPoints = newPoints;
            while (tempPoints >= pointsToNextLevel) {
                tempPoints -= pointsToNextLevel;
                newLevel += 1;
                pointsToNextLevel = newLevel * 100;
            }
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    points: tempPoints,
                    level: newLevel,
                    lastActivityAt: new Date(),
                },
            });
            const count = await this.prisma.readingJournal.count({ where: { userId } });
            if (count === 1) {
                await this.prisma.achievement.create({
                    data: {
                        type: 'FIRST_STEPS',
                        title: 'Primeiros Passos Literários',
                        progress: 1,
                        target: 1,
                        userId,
                    },
                }).catch(() => { });
            }
            const totalPagesRes = await this.prisma.readingJournal.aggregate({
                where: { userId },
                _sum: { pagesRead: true },
            });
            const totalPages = totalPagesRes._sum.pagesRead || 0;
            if (totalPages >= 500) {
                await this.prisma.achievement.create({
                    data: {
                        type: 'DEEP_READER',
                        title: 'Devorador de Livros',
                        progress: totalPages,
                        target: 500,
                        userId,
                    },
                }).catch(() => { });
            }
        }
        return journal;
    }
    async findAll(userId) {
        return this.prisma.readingJournal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, id) {
        const journal = await this.prisma.readingJournal.findFirst({
            where: { id, userId },
        });
        if (!journal)
            throw new common_1.NotFoundException('Registro de diário não encontrado');
        return journal;
    }
    async remove(userId, id) {
        const journal = await this.findOne(userId, id);
        return this.prisma.readingJournal.delete({
            where: { id: journal.id },
        });
    }
};
exports.JournalService = JournalService;
exports.JournalService = JournalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        club_service_1.ClubService])
], JournalService);
//# sourceMappingURL=journal.service.js.map