import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    saveMessage(userId: string, content: string, clubId?: string, eventId?: string): Promise<{
        user: {
            username: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        clubId: string | null;
        eventId: string | null;
    }>;
    getMessages(clubId?: string, eventId?: string): Promise<({
        user: {
            username: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        clubId: string | null;
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
