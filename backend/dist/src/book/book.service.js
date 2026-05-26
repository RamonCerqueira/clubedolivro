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
exports.BookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookService = class BookService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.book.create({ data });
    }
    async findAll() {
        return this.prisma.book.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    async findOne(id) {
        const book = await this.prisma.book.findUnique({
            where: { id },
            include: {
                discussions: {
                    include: { author: { select: { id: true, username: true, avatar: true, level: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
                _count: { select: { discussions: true } },
            },
        });
        if (!book)
            throw new common_1.NotFoundException('Livro não encontrado');
        return book;
    }
    async update(id, data) {
        return this.prisma.book.update({ where: { id }, data });
    }
    async remove(id) {
        return this.prisma.book.delete({ where: { id } });
    }
    async search(query, tags) {
        return this.prisma.book.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { author: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
                ...(tags && tags.length > 0 ? { categories: { hasSome: tags } } : {}),
            },
            take: 20,
        });
    }
    async recommendBooks(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { interests: true },
        });
        if (!user || user.interests.length === 0) {
            return this.prisma.book.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
            });
        }
        return this.prisma.book.findMany({
            where: { categories: { hasSome: user.interests } },
            take: 10,
        });
    }
    async createDiscussion(bookId, authorId, data) {
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book)
            throw new common_1.NotFoundException('Livro não encontrado');
        return this.prisma.bookDiscussion.create({
            data: {
                content: data.content,
                chapter: data.chapter,
                bookId,
                authorId,
            },
            include: {
                author: { select: { id: true, username: true, avatar: true, level: true } },
            },
        });
    }
    async getDiscussions(bookId, chapter) {
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book)
            throw new common_1.NotFoundException('Livro não encontrado');
        return this.prisma.bookDiscussion.findMany({
            where: {
                bookId,
                ...(chapter !== undefined ? { chapter } : {}),
            },
            include: {
                author: { select: { id: true, username: true, avatar: true, level: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async deleteDiscussion(discussionId, userId) {
        const discussion = await this.prisma.bookDiscussion.findUnique({
            where: { id: discussionId },
        });
        if (!discussion)
            throw new common_1.NotFoundException('Discussão não encontrada');
        if (discussion.authorId !== userId) {
            throw new common_1.NotFoundException('Sem permissão para excluir esta discussão');
        }
        return this.prisma.bookDiscussion.delete({ where: { id: discussionId } });
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookService);
//# sourceMappingURL=book.service.js.map