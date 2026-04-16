import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(userId: string, content: string, clubId?: string, eventId?: string, receiverId?: string) {
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

  async getMessages(clubId?: string, eventId?: string, userId?: string, receiverId?: string) {
    if (userId && receiverId) {
      // Direct Message logic: user is either sender or receiver
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

  async createDiscussion(userId: string, bookId: string, content: string, chapter?: number) {
    return this.prisma.bookDiscussion.create({
      data: { content, bookId, authorId: userId, chapter },
      include: { author: { select: { username: true, avatar: true } } },
    });
  }

  async getDiscussions(bookId: string) {
    return this.prisma.bookDiscussion.findMany({
      where: { bookId },
      include: { author: { select: { username: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
