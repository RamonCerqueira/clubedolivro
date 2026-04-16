import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../gateway/events/events.gateway';
export declare class NotificationService {
    private prisma;
    private gateway;
    constructor(prisma: PrismaService, gateway: EventsGateway);
    notifyUser(userId: string, type: 'MESSAGE' | 'INVITE' | 'RANK' | 'RSVP', content: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        read: boolean;
    }>;
    getNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        read: boolean;
    }[]>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        read: boolean;
    }>;
}
