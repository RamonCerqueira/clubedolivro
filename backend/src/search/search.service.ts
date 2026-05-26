import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, currentUserId?: string) {
    if (!query || query.trim().length < 2) {
      return { users: [], clubs: [], books: [], events: [] };
    }

    const q = query.trim();

    const [users, clubs, books, events] = await Promise.all([
      // Users
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

      // Clubs
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

      // Books
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

      // Events
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
}
