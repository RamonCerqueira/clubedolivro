import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReadingListService {
  constructor(private prisma: PrismaService) {}

  async getUserLists(userId: string) {
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

  async createList(userId: string, data: { name: string; type?: string }) {
    return this.prisma.readingList.create({
      data: {
        name: data.name,
        type: (data.type as any) || 'CUSTOM',
        userId,
      },
    });
  }

  async addItem(userId: string, listId: string, bookId: string) {
    // Verify ownership
    const list = await this.prisma.readingList.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundException('Lista não encontrada');
    if (list.userId !== userId) throw new ForbiddenException('Sem permissão');

    // Verify book exists
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Livro não encontrado');

    return this.prisma.readingListItem.upsert({
      where: { listId_bookId: { listId, bookId } },
      create: { listId, bookId },
      update: {},
      include: { book: { select: { id: true, title: true, author: true, cover: true } } },
    });
  }

  async removeItem(userId: string, listId: string, bookId: string) {
    const list = await this.prisma.readingList.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundException('Lista não encontrada');
    if (list.userId !== userId) throw new ForbiddenException('Sem permissão');

    return this.prisma.readingListItem.delete({
      where: { listId_bookId: { listId, bookId } },
    });
  }

  async deleteList(userId: string, listId: string) {
    const list = await this.prisma.readingList.findUnique({ where: { id: listId } });
    if (!list) throw new NotFoundException('Lista não encontrada');
    if (list.userId !== userId) throw new ForbiddenException('Sem permissão');

    return this.prisma.readingList.delete({ where: { id: listId } });
  }

  // Initialize default lists for a new user
  async initDefaultLists(userId: string) {
    const defaults = [
      { name: 'Quero Ler', type: 'WANT_TO_READ' },
      { name: 'Lendo Agora', type: 'READING' },
      { name: 'Já Li', type: 'READ' },
    ];

    for (const list of defaults) {
      await this.prisma.readingList.upsert({
        where: {
          // workaround: find existing
          id: `placeholder-${userId}-${list.type}`,
        },
        create: { name: list.name, type: list.type as any, userId },
        update: {},
      }).catch(() => {
        // If constraint fails, just create
        return this.prisma.readingList.create({
          data: { name: list.name, type: list.type as any, userId },
        }).catch(() => null);
      });
    }
  }
}
