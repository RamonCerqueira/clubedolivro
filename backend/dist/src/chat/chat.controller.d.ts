import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getHistory(req: any, clubId?: string, eventId?: string, receiverId?: string): Promise<({
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
    sendMessage(req: any, body: {
        content: string;
        clubId?: string;
        eventId?: string;
        receiverId?: string;
    }): Promise<{
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
    createDiscussion(req: any, body: {
        bookId: string;
        content: string;
        chapter?: number;
    }): Promise<{
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
