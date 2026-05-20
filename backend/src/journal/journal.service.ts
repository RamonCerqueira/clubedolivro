import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClubService } from '../club/club.service';

@Injectable()
export class JournalService {
  constructor(
    private prisma: PrismaService,
    private clubService: ClubService,
  ) {}

  async create(userId: string, data: { 
    bookTitle: string; 
    author?: string; 
    pagesRead: number; 
    feelings: string[]; 
    notes?: string;
    mediaUrl?: string;
    mediaType?: string;
    postToFeed?: boolean;
  }) {
    // 1. Criar o registro no Diário
    const journal = await this.prisma.readingJournal.create({
      data: {
        userId,
        bookTitle: data.bookTitle,
        author: data.author,
        pagesRead: data.pagesRead,
        feelings: data.feelings,
        notes: data.notes,
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaType,
      },
    });

    // Auto-post to Global Feed if requested
    if (data.postToFeed) {
      let feedContent = `📖 Diário de Bordo: Li ${data.pagesRead} páginas de "${data.bookTitle}"${data.author ? ` (${data.author})` : ''}!\n\n`;
      if (data.feelings && data.feelings.length > 0) {
        feedContent += `✨ Sentimentos: ${data.feelings.join(', ')}\n`;
      }
      if (data.notes) {
        feedContent += `📝 Anotações: ${data.notes}`;
      }

      await this.clubService.createPost(
        userId, 
        feedContent, 
        undefined, 
        undefined, 
        data.mediaUrl, 
        data.mediaType
      ).catch(e => console.error('Failed to auto-post journal to feed', e));
    }

    // 2. Dar pontos de gamificação! Cada página lida dá 2 pontos de XP/Gamificação
    const earnedPoints = data.pagesRead * 2;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { points: true, level: true },
    });

    if (user) {
      const newPoints = user.points + earnedPoints;
      // Regra simples de level up: cada level exige level * 100 pontos
      let newLevel = user.level;
      let pointsToNextLevel = newLevel * 100;

      let tempPoints = newPoints;
      while (tempPoints >= pointsToNextLevel) {
        tempPoints -= pointsToNextLevel;
        newLevel += 1;
        pointsToNextLevel = newLevel * 100;
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          points: tempPoints, // Guarda os pontos restantes do level atual
          level: newLevel,
          lastActivityAt: new Date(),
        },
      });

      // Se desbloqueou uma meta/achievement, podemos criar o registro de Achievement
      // Ex: Primeira leitura registrada
      const count = await this.prisma.readingJournal.count({ where: { userId } });
      if (count === 1) {
        await this.prisma.achievement.create({
          data: {
            type: 'FIRST_STEPS',
            title: 'Primeiros Passos Literários',
            progress: 1,
            target: 1,
            userId,
          },
        }).catch(() => {}); // Evitar quebrar se já existir
      }

      // Se leu mais de 500 páginas no total
      const totalPagesRes = await this.prisma.readingJournal.aggregate({
        where: { userId },
        _sum: { pagesRead: true },
      });
      const totalPages = totalPagesRes._sum.pagesRead || 0;

      if (totalPages >= 500) {
        await this.prisma.achievement.create({
          data: {
            type: 'DEEP_READER',
            title: 'Devorador de Livros',
            progress: totalPages,
            target: 500,
            userId,
          },
        }).catch(() => {});
      }
    }

    return journal;
  }

  async findAll(userId: string) {
    return this.prisma.readingJournal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const journal = await this.prisma.readingJournal.findFirst({
      where: { id, userId },
    });
    if (!journal) throw new NotFoundException('Registro de diário não encontrado');
    return journal;
  }

  async remove(userId: string, id: string) {
    const journal = await this.findOne(userId, id);
    return this.prisma.readingJournal.delete({
      where: { id: journal.id },
    });
  }
}
