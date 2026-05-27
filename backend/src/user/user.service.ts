import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

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
    
    // Connect follow relation
    const updatedFollower = await this.prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          connect: { id: followingId },
        },
      },
    });

    const followerUser = await this.prisma.user.findUnique({
      where: { id: followerId },
      select: { username: true }
    });

    const followedUser = await this.prisma.user.findUnique({
      where: { id: followingId },
      select: { username: true }
    });

    // Check if followingId is also following followerId (mutual follow)
    const isMutual = await this.prisma.user.findFirst({
      where: {
        id: followingId,
        following: {
          some: {
            id: followerId
          }
        }
      }
    });

    if (isMutual) {
      // Send mutual friendship notification to both
      await this.notificationService.notifyUser(
        followingId,
        'INVITE',
        `✨ Você e ${followerUser?.username} agora são amigos mútuos!`
      ).catch(e => console.error('Failed to notify follow', e));

      await this.notificationService.notifyUser(
        followerId,
        'INVITE',
        `✨ Você e ${followedUser?.username} agora são amigos mútuos!`
      ).catch(e => console.error('Failed to notify follow', e));
    } else {
      // Single follow notification
      await this.notificationService.notifyUser(
        followingId,
        'INVITE',
        `👤 ${followerUser?.username} começou a te seguir!`
      ).catch(e => console.error('Failed to notify follow', e));
    }

    return updatedFollower;
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

  async getProfile(id: string, viewerId?: string) {
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
        achievements: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    
    let isFollowing = false;
    let isFollowedBy = false;

    if (viewerId && viewerId !== id) {
      const followCheck = await this.prisma.user.findUnique({
        where: { id: viewerId },
        select: {
          following: { where: { id } },
          followedBy: { where: { id } }
        }
      });
      isFollowing = (followCheck?.following?.length ?? 0) > 0;
      isFollowedBy = (followCheck?.followedBy?.length ?? 0) > 0;
    }

    // Remove sensitive data
    const { password, ...safeUser } = user;
    return { ...safeUser, isFollowing, isFollowedBy };
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

  async getUserStatistics(id: string) {
    const journals = await this.prisma.readingJournal.findMany({
      where: { userId: id },
      select: { pagesRead: true }
    });
    const totalPagesRead = journals.reduce((acc, curr) => acc + curr.pagesRead, 0);

    const readBooks = await this.prisma.readingListItem.findMany({
      where: { list: { userId: id, type: 'READ' } },
      include: { book: true }
    });

    const booksReadCount = readBooks.length;
    
    const categoriesCount: Record<string, number> = {};
    readBooks.forEach(item => {
      item.book.categories.forEach(cat => {
        categoriesCount[cat] = (categoriesCount[cat] || 0) + 1;
      });
    });

    const favoriteCategories = Object.entries(categoriesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);

    return { totalPagesRead, booksReadCount, favoriteCategories };
  }

  async getRecommendations(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { interests: true, following: { select: { id: true } } }
    });

    if (!user) return [];

    const followingIds = user.following.map(f => f.id);
    followingIds.push(userId);

    return this.prisma.user.findMany({
      where: { id: { notIn: followingIds }, interests: { hasSome: user.interests } },
      select: { id: true, username: true, avatar: true, bio: true, interests: true },
      take: 10
    });
  }

  async getUserActivity(id: string) {
    const posts = await this.prisma.clubPost.findMany({
      where: { authorId: id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { club: { select: { name: true } } }
    });

    const rsvps = await this.prisma.eventRsvp.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { event: { select: { title: true, date: true } } }
    });

    const readingListItems = await this.prisma.readingListItem.findMany({
      where: { list: { userId: id } },
      orderBy: { addedAt: 'desc' },
      take: 10,
      include: { book: { select: { title: true, author: true } }, list: { select: { type: true } } }
    });

    const journals = await this.prisma.readingJournal.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const activity = [
      ...posts.map(p => ({ type: 'POST', date: p.createdAt, data: p })),
      ...rsvps.map(r => ({ type: 'RSVP', date: r.createdAt, data: r })),
      ...readingListItems.map(r => ({ type: 'READING_LIST', date: r.addedAt, data: r })),
      ...journals.map(j => ({ type: 'JOURNAL', date: j.createdAt, data: j }))
    ];

    return activity.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 20);
  }
}
