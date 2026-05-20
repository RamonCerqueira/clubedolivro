import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../gateway/events/events.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => EventsGateway))
    private gateway: EventsGateway,
  ) {}

  async notifyUser(userId: string, type: 'MESSAGE' | 'INVITE' | 'RANK' | 'RSVP', content: string) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        content,
      },
    });

    // Real-time push via WebSocket
    this.gateway.server.to(userId).emit('notification', notification);

    return notification;
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
}
