import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class ClubService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private gamificationService: GamificationService,
  ) {}

  async create(creatorId: string, data: Partial<Prisma.ClubCreateInput>) {
    return this.prisma.club.create({
      data: {
        name: data.name!,
        description: data.description,
        city: data.city,
        isPrivate: data.isPrivate || false,
        creator: { connect: { id: creatorId } },
        members: {
          create: [{ userId: creatorId, role: 'ADMIN' }]
        }
      }
    });
  }

  async findAll() {
    return this.prisma.club.findMany({
      include: { _count: { select: { members: true } } }
    });
  }

  async findOne(id: string) {
    const club = await this.prisma.club.findUnique({
      where: { id },
      include: { 
        members: { include: { user: true } }, 
        events: true,
        _count: { select: { members: true, posts: true } }
      }
    });
    if (!club) throw new NotFoundException('Club not found');
    return club;
  }

  // Invites
  async createInvite(clubId: string) {
    const token = Math.random().toString(36).substring(2, 15);
    return this.prisma.clubInvite.create({
      data: {
        token,
        clubId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });
  }

  async joinViaInvite(userId: string, token: string) {
    const invite = await this.prisma.clubInvite.findUnique({
      where: { token },
      include: { club: true }
    });

    if (!invite || (invite.expiresAt && invite.expiresAt < new Date())) {
      throw new BadRequestException('Invalid or expired invite');
    }

    return this.prisma.clubMember.create({
      data: {
        userId,
        clubId: invite.clubId,
        role: 'MEMBER'
      }
    });
  }

  // Join Requests
  async requestToJoin(userId: string, clubId: string) {
    const club = await this.findOne(clubId);
    if (!club.isPrivate) {
      return this.prisma.clubMember.create({
        data: { userId, clubId, role: 'MEMBER' }
      });
    }

    const request = await this.prisma.clubJoinRequest.create({
      data: { userId, clubId }
    });

    // Notify Admin
    await this.notificationService.notifyUser(
      club.creatorId,
      'INVITE',
      `Novo pedido de entrada no clube "${club.name}"`
    );

    return request;
  }

  async handleJoinRequest(operatorId: string, requestId: string, status: 'APPROVED' | 'REJECTED') {
    const request = await this.prisma.clubJoinRequest.findUnique({
      where: { id: requestId },
      include: { club: true }
    });

    if (!request) throw new NotFoundException('Request not found');

    // Check if operator is Admin/Moderator
    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: request.clubId, userId: operatorId } }
    });

    if (!membership || (membership.role !== 'ADMIN' && membership.role !== 'MODERATOR')) {
      throw new BadRequestException('Unauthorized');
    }

    if (status === 'APPROVED') {
      await this.prisma.clubMember.create({
        data: { userId: request.userId, clubId: request.clubId, role: 'MEMBER' }
      });
    }

    return this.prisma.clubJoinRequest.update({
      where: { id: requestId },
      data: { status }
    });
  }

  // Feed
  async createPost(userId: string, clubId?: string, content: string) {
    if (clubId) {
      // Check membership if clubId is provided
      const membership = await this.prisma.clubMember.findUnique({
        where: { clubId_userId: { clubId, userId } }
      });
      if (!membership) throw new BadRequestException('Must be a member of the club to post there');
    }

    const post = await this.prisma.clubPost.create({
      data: { content, clubId, authorId: userId }
    });

    await this.gamificationService.addPoints(userId, 10, clubId ? 'Publicou uma discussão no clube' : 'Fez uma postagem no feed global');

    return post;
  }

  async getFeed(clubId: string) {
    return this.prisma.clubPost.findMany({
      where: { clubId },
      include: { author: { select: { username: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  async getGlobalFeed() {
    return this.prisma.clubPost.findMany({
      where: {
        OR: [
          { clubId: null },
          { club: { isPrivate: false } }
        ]
      },
      include: { 
        author: { select: { username: true, avatar: true } },
        club: { select: { name: true, id: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}
