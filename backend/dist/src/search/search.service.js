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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(query, currentUserId) {
        if (!query || query.trim().length < 2) {
            return { users: [], clubs: [], books: [], events: [] };
        }
        const q = query.trim();
        const [users, clubs, books, events] = await Promise.all([
            this.prisma.user.findMany({
                where: {
                    OR: [
                        { username: { contains: q, mode: 'insensitive' } },
                        { bio: { contains: q, mode: 'insensitive' } },
                    ],
                    NOT: currentUserId ? { id: currentUserId } : undefined,
                },
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    bio: true,
                    level: true,
                    _count: { select: { followedBy: true, memberships: true } },
                },
                take: 5,
            }),
            this.prisma.club.findMany({
                where: {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } },
                        { city: { contains: q, mode: 'insensitive' } },
                    ],
                    isPrivate: false,
                },
                include: { _count: { select: { members: true } } },
                take: 5,
            }),
            this.prisma.book.findMany({
                where: {
                    OR: [
                        { title: { contains: q, mode: 'insensitive' } },
                        { author: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } },
                    ],
                },
                select: {
                    id: true,
                    title: true,
                    author: true,
                    cover: true,
                    categories: true,
                    description: true,
                },
                take: 5,
            }),
            this.prisma.event.findMany({
                where: {
                    OR: [
                        { title: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } },
                    ],
                    club: { isPrivate: false },
                },
                include: {
                    club: { select: { name: true, id: true } },
                    _count: { select: { rsvps: true } },
                },
                take: 5,
            }),
        ]);
        return {
            users,
            clubs,
            books,
            events,
            total: users.length + clubs.length + books.length + events.length,
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map