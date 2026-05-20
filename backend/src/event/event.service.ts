import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('reminders') private remindersQueue: Queue,
    private gamificationService: GamificationService,
  ) {}

  async createEvent(clubId: string, organizerId: string, data: Partial<Prisma.EventCreateInput>) {
    // 1. Anti-Spam Check: Max 2 events per user per 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentEventsCount = await this.prisma.event.count({
      where: {
        organizerId,
        createdAt: { gte: oneDayAgo }
      }
    });

    if (recentEventsCount >= 2) {
      throw new BadRequestException('Anti-spam: You can only create 2 events every 24 hours.');
    }

    // 2. Rule: minimum 5 members to create event
    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      include: { _count: { select: { members: true } } }
    });

    if (!club) throw new NotFoundException('Club not found');
    if (club._count.members < 5) {
      throw new BadRequestException('Club must have at least 5 members to create events.');
    }

    const event = await this.prisma.event.create({
      data: {
        title: data.title!,
        date: new Date(data.date as any),
        type: data.type as any,
        description: data.description,
        club: { connect: { id: clubId } },
        organizer: { connect: { id: organizerId } },
      }
    });

    this.logger.log(`Created new event "${event.title}" (ID: ${event.id}) for club ${clubId} by organizer ${organizerId}`);

    // 3. Schedule Reminder: 1 hour before the event
    const delay = new Date(event.date).getTime() - Date.now() - (60 * 60 * 1000);
    if (delay > 0) {
      await this.remindersQueue.add('event-reminder', { eventId: event.id }, { delay });
    }

    await this.gamificationService.addPoints(organizerId, 50, 'Organizou um novo evento literário');

    return event;
  }

  async rsvp(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { rsvps: true } } }
    });
    if (!event) throw new NotFoundException('Event not found');

    if (event.participantLimit && event._count.rsvps >= event.participantLimit) {
      throw new BadRequestException('Event is full');
    }

    const existingRsvp = await this.prisma.eventRsvp.findUnique({
      where: { eventId_userId: { eventId, userId } }
    });

    if (existingRsvp) {
      throw new BadRequestException('User already RSVPd');
    }

    const rsvp = await this.prisma.eventRsvp.create({
      data: {
        event: { connect: { id: eventId } },
        user: { connect: { id: userId } },
        status: 'CONFIRMED'
      }
    });

    this.logger.log(`User ${userId} RSVP'd successfully to event "${event.title}" (ID: ${eventId})`);

    await this.gamificationService.addPoints(userId, 20, 'Confirmou presença em evento');

    // Check if we reach >= 3 RSVPs to confirm event automatically
    const rsvpCount = await this.prisma.eventRsvp.count({
      where: { eventId, status: 'CONFIRMED' }
    });

    if (rsvpCount >= 3 && event.status === 'DRAFT') {
      await this.prisma.event.update({
        where: { id: eventId },
        data: { status: 'CONFIRMED' }
      });
    }

    return rsvp;
  }

  async findAll(userId?: string) {
    const whereClause: Prisma.EventWhereInput = {
      club: {
        OR: [
          { isPrivate: false },
          ...(userId ? [{
            members: {
              some: {
                userId: userId
              }
            }
          }] : [])
        ]
      }
    };

    return this.prisma.event.findMany({
      where: whereClause,
      include: { club: true, organizer: true, _count: { select: { rsvps: true } } }
    });
  }
}
