import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async addPoints(userId: string, points: number, reason: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      this.logger.warn(`Failed to add points: User with ID ${userId} not found.`);
      return;
    }

    const newPoints = user.points + points;
    const newLevel = Math.floor(newPoints / 100) + 1;

    this.logger.log(
      `Adding ${points} points to user ${user.username} (ID: ${userId}). Reason: "${reason}". Current points: ${user.points} -> New points: ${newPoints}.`
    );

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        points: newPoints,
        level: newLevel,
        lastActivityAt: new Date(),
      },
    });

    if (newLevel > user.level) {
      this.logger.log(
        `User ${user.username} (ID: ${userId}) leveled up: ${user.level} -> ${newLevel}!`
      );
      await this.notificationService.notifyUser(
        userId,
        'RANK',
        `Parabéns! Você alcançou o nível ${newLevel}!`,
      );
    }

    return updatedUser;
  }

  async updateStreak(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const now = new Date();
    const lastActivity = new Date(user.lastActivityAt);
    const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    let newStreak = user.streak;

    if (diffHours > 24 && diffHours < 48) {
      newStreak += 1;
    } else if (diffHours >= 48) {
      newStreak = 1; // Reset or start over
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { 
        streak: newStreak,
        lastActivityAt: now,
      },
    });
  }

  async getGlobalRanking() {
    return this.prisma.user.findMany({
      orderBy: { points: 'desc' },
      take: 10,
      select: {
        username: true,
        avatar: true,
        level: true,
        points: true,
      },
    });
  }
}
