import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
export declare class ChatService {
    private prisma;
    private notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    saveMessage(userId: string, content: string, clubId?: string, eventId?: string, receiverId?: string): Promise<{
        user: {
            username: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        audioUrl: string | null;
        clubId: string | null;
        receiverId: string | null;
        eventId: string | null;
    }>;
    getMessages(clubId?: string, eventId?: string, userId?: string, receiverId?: string): Promise<({
        user: {
            username: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        audioUrl: string | null;
        clubId: string | null;
        receiverId: string | null;
        eventId: string | null;
    })[]>;
    createDiscussion(userId: string, bookId: string, content: string, chapter?: number): Promise<{
        author: {
            username: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        chapter: number | null;
        bookId: string;
    }>;
    getDiscussions(bookId: string): Promise<({
        author: {
            username: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        chapter: number | null;
        bookId: string;
    })[]>;
}
