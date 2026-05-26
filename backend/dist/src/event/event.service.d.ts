import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GamificationService } from '../gamification/gamification.service';
export declare class EventService {
    private prisma;
    private remindersQueue;
    private gamificationService;
    private readonly logger;
    constructor(prisma: PrismaService, remindersQueue: Queue, gamificationService: GamificationService);
    createEvent(clubId: string, organizerId: string, data: Partial<Prisma.EventCreateInput>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        clubId: string;
        date: Date;
        type: import("@prisma/client").$Enums.EventType;
        link: string | null;
        address: string | null;
        locationLat: number | null;
        locationLng: number | null;
        status: import("@prisma/client").$Enums.EventStatus;
        participantLimit: number | null;
        organizerId: string;
    }>;
    rsvp(eventId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.RsvpStatus;
        eventId: string;
    }>;
    findAll(userId?: string): Promise<({
        club: {
            id: string;
            city: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isPrivate: boolean;
            creatorId: string;
            currentBookId: string | null;
        };
        organizer: {
            id: string;
            username: string;
            email: string;
            password: string | null;
            avatar: string | null;
            bio: string | null;
            city: string | null;
            level: number;
            points: number;
            streak: number;
            lastActivityAt: Date;
            interests: string[];
            createdAt: Date;
            updatedAt: Date;
        };
        _count: {
            rsvps: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        clubId: string;
        date: Date;
        type: import("@prisma/client").$Enums.EventType;
        link: string | null;
        address: string | null;
        locationLat: number | null;
        locationLng: number | null;
        status: import("@prisma/client").$Enums.EventStatus;
        participantLimit: number | null;
        organizerId: string;
    })[]>;
}
