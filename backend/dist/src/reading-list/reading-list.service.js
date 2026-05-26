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
exports.ReadingListService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReadingListService = class ReadingListService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserLists(userId) {
        return this.prisma.readingList.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        book: {
                            select: { id: true, title: true, author: true, cover: true, categories: true },
                        },
                    },
                    orderBy: { addedAt: 'desc' },
                },
                _count: { select: { items: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async createList(userId, data) {
        return this.prisma.readingList.create({
            data: {
                name: data.name,
                type: data.type || 'CUSTOM',
                userId,
            },
        });
    }
    async addItem(userId, listId, bookId) {
        const list = await this.prisma.readingList.findUnique({ where: { id: listId } });
        if (!list)
            throw new common_1.NotFoundException('Lista não encontrada');
        if (list.userId !== userId)
            throw new common_1.ForbiddenException('Sem permissão');
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book)
            throw new common_1.NotFoundException('Livro não encontrado');
        return this.prisma.readingListItem.upsert({
            where: { listId_bookId: { listId, bookId } },
            create: { listId, bookId },
            update: {},
            include: { book: { select: { id: true, title: true, author: true, cover: true } } },
        });
    }
    async removeItem(userId, listId, bookId) {
        const list = await this.prisma.readingList.findUnique({ where: { id: listId } });
        if (!list)
            throw new common_1.NotFoundException('Lista não encontrada');
        if (list.userId !== userId)
            throw new common_1.ForbiddenException('Sem permissão');
        return this.prisma.readingListItem.delete({
            where: { listId_bookId: { listId, bookId } },
        });
    }
    async deleteList(userId, listId) {
        const list = await this.prisma.readingList.findUnique({ where: { id: listId } });
        if (!list)
            throw new common_1.NotFoundException('Lista não encontrada');
        if (list.userId !== userId)
            throw new common_1.ForbiddenException('Sem permissão');
        return this.prisma.readingList.delete({ where: { id: listId } });
    }
    async initDefaultLists(userId) {
        const defaults = [
            { name: 'Quero Ler', type: 'WANT_TO_READ' },
            { name: 'Lendo Agora', type: 'READING' },
            { name: 'Já Li', type: 'READ' },
        ];
        for (const list of defaults) {
            await this.prisma.readingList.upsert({
                where: {
                    id: `placeholder-${userId}-${list.type}`,
                },
                create: { name: list.name, type: list.type, userId },
                update: {},
            }).catch(() => {
                return this.prisma.readingList.create({
                    data: { name: list.name, type: list.type, userId },
                }).catch(() => null);
            });
        }
    }
};
exports.ReadingListService = ReadingListService;
exports.ReadingListService = ReadingListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReadingListService);
//# sourceMappingURL=reading-list.service.js.map