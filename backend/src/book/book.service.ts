import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BookCreateInput) {
    return this.prisma.book.create({ data });
  }

  async findAll() {
    return this.prisma.book.findMany();
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, data: Prisma.BookUpdateInput) {
    return this.prisma.book.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.book.delete({ where: { id } });
  }

  async search(query: string, tags?: string[]) {
    return this.prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
        ],
        ...(tags && tags.length > 0
          ? { categories: { hasSome: tags } }
          : {}),
      },
    });
  }

  async recommendBooks(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { interests: true },
    });

    if (!user || user.interests.length === 0) {
      // Fallback: Return most recent books if no interests
      return this.prisma.book.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.book.findMany({
      where: {
        categories: { hasSome: user.interests },
      },
      take: 10,
    });
  }
}
