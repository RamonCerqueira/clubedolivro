import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoalService {
  constructor(private prisma: PrismaService) {}

  async create(clubId: string, data: { title: string; targetPages: number; endDate: string }) {
    const club = await this.prisma.club.findUnique({ where: { id: clubId } });
    if (!club) throw new NotFoundException('Clube não encontrado');

    return this.prisma.clubGoal.create({
      data: {
        clubId,
        title: data.title,
        targetPages: data.targetPages,
        endDate: new Date(data.endDate),
      },
    });
  }

  async addProgress(clubId: string, goalId: string, pages: number) {
    const goal = await this.prisma.clubGoal.findFirst({
      where: { id: goalId, clubId },
    });
    if (!goal) throw new NotFoundException('Meta não encontrada no clube informado');

    const updatedGoal = await this.prisma.clubGoal.update({
      where: { id: goalId },
      data: {
        currentPages: {
          increment: pages,
        },
      },
    });

    // Se o progresso atingir ou ultrapassar a meta, podemos notificar ou marcar como sucesso de alguma forma!
    // Para simplificar, retornamos o status atualizado da meta
    return updatedGoal;
  }

  async findAllByClub(clubId: string) {
    const club = await this.prisma.club.findUnique({ where: { id: clubId } });
    if (!club) throw new NotFoundException('Clube não encontrado');

    return this.prisma.clubGoal.findMany({
      where: { clubId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(clubId: string, id: string) {
    const goal = await this.prisma.clubGoal.findFirst({
      where: { id, clubId },
    });
    if (!goal) throw new NotFoundException('Meta não encontrada');

    return this.prisma.clubGoal.delete({
      where: { id },
    });
  }
}
