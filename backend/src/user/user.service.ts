import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) throw new Error('Cannot follow yourself');
    return this.prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          connect: { id: followingId },
        },
      },
    });
  }

  async unfollowUser(followerId: string, followingId: string) {
    return this.prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          disconnect: { id: followingId },
        },
      },
    });
  }

  async updateInterests(id: string, interests: string[]) {
    return this.prisma.user.update({
      where: { id },
      data: { interests },
    });
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            following: true,
            followedBy: true,
            memberships: true,
            organizedEvents: true,
            rsvps: true,
          },
        },
        memberships: {
          include: { club: true },
          take: 5,
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    
    // Remove sensitive data
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async getFollowing(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            bio: true,
            level: true,
          }
        }
      }
    });
    return user?.following || [];
  }

  async getFollowers(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        followedBy: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            bio: true,
            level: true,
          }
        }
      }
    });
    return user?.followedBy || [];
  }

  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } },
        ]
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        level: true,
      },
      take: 20
    });
  }
}
