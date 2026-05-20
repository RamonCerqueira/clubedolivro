import { JournalService } from './journal.service';
export declare class JournalController {
    private readonly journalService;
    constructor(journalService: JournalService);
    create(req: any, data: {
        bookTitle: string;
        author?: string;
        pagesRead: number;
        feelings: string[];
        notes?: string;
        mediaUrl?: string;
        mediaType?: string;
        postToFeed?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        author: string | null;
        userId: string;
        mediaUrl: string | null;
        mediaType: string | null;
        bookTitle: string;
        pagesRead: number;
        feelings: string[];
        notes: string | null;
    }>;
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        author: string | null;
        userId: string;
        mediaUrl: string | null;
        mediaType: string | null;
        bookTitle: string;
        pagesRead: number;
        feelings: string[];
        notes: string | null;
    }[]>;
    findOne(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        author: string | null;
        userId: string;
        mediaUrl: string | null;
        mediaType: string | null;
        bookTitle: string;
        pagesRead: number;
        feelings: string[];
        notes: string | null;
    }>;
    remove(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        author: string | null;
        userId: string;
        mediaUrl: string | null;
        mediaType: string | null;
        bookTitle: string;
        pagesRead: number;
        feelings: string[];
        notes: string | null;
    }>;
}
