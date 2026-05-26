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
    return this.prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findOne(id: string) {
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
    if (!book) throw new NotFoundException('Livro não encontrado');
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
          { description: { contains: query, mode: 'insensitive' } },
        ],
        ...(tags && tags.length > 0 ? { categories: { hasSome: tags } } : {}),
      },
      take: 20,
    });
  }

  async recommendBooks(userId: string) {
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

  // ─── Discussões de Livros ─────────────────────────────────────────────────

  async createDiscussion(
    bookId: string,
    authorId: string,
    data: { content: string; chapter?: number },
  ) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Livro não encontrado');

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

  async getDiscussions(bookId: string, chapter?: number) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Livro não encontrado');

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

  async deleteDiscussion(discussionId: string, userId: string) {
    const discussion = await this.prisma.bookDiscussion.findUnique({
      where: { id: discussionId },
    });
    if (!discussion) throw new NotFoundException('Discussão não encontrada');
    if (discussion.authorId !== userId) {
      throw new NotFoundException('Sem permissão para excluir esta discussão');
    }
    return this.prisma.bookDiscussion.delete({ where: { id: discussionId } });
  }
}
