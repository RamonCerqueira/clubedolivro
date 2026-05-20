import { PrismaService } from '../prisma/prisma.service';
import { ClubService } from '../club/club.service';
export declare class JournalService {
    private prisma;
    private clubService;
    constructor(prisma: PrismaService, clubService: ClubService);
    create(userId: string, data: {
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
    findAll(userId: string): Promise<{
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
    findOne(userId: string, id: string): Promise<{
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
    remove(userId: string, id: string): Promise<{
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
