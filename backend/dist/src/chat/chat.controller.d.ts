import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getHistory(clubId?: string, eventId?: string): Promise<({
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
