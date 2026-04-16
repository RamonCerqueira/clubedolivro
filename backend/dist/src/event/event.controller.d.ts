import { EventService } from './event.service';
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    create(req: any, body: any): Promise<{
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
    findAll(): Promise<({
        club: {
            id: string;
            city: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isPrivate: boolean;
            creatorId: string;
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
    rsvp(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.RsvpStatus;
        eventId: string;
    }>;
}
