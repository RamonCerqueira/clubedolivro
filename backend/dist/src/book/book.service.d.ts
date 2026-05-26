import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class BookService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.BookCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        author: string;
        description: string | null;
        categories: string[];
        cover: string | null;
        pdfUrl: string | null;
        externalLink: string | null;
        uploaderId: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        author: string;
        description: string | null;
        categories: string[];
        cover: string | null;
        pdfUrl: string | null;
        externalLink: string | null;
        uploaderId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        discussions: ({
            author: {
                id: string;
                username: string;
                avatar: string | null;
                level: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: string;
            chapter: number | null;
            bookId: string;
        })[];
        _count: {
            discussions: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        author: string;
        description: string | null;
        categories: string[];
        cover: string | null;
        pdfUrl: string | null;
        externalLink: string | null;
        uploaderId: string | null;
    }>;
    update(id: string, data: Prisma.BookUpdateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        author: string;
        description: string | null;
        categories: string[];
        cover: string | null;
        pdfUrl: string | null;
        externalLink: string | null;
        uploaderId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        author: string;
        description: string | null;
        categories: string[];
        cover: string | null;
        pdfUrl: string | null;
        externalLink: string | null;
        uploaderId: string | null;
    }>;
    search(query: string, tags?: string[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        author: string;
        description: string | null;
        categories: string[];
        cover: string | null;
        pdfUrl: string | null;
        externalLink: string | null;
        uploaderId: string | null;
    }[]>;
    recommendBooks(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        author: string;
        description: string | null;
        categories: string[];
        cover: string | null;
        pdfUrl: string | null;
        externalLink: string | null;
        uploaderId: string | null;
    }[]>;
    createDiscussion(bookId: string, authorId: string, data: {
        content: string;
        chapter?: number;
    }): Promise<{
        author: {
            id: string;
            username: string;
            avatar: string | null;
            level: number;
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
    getDiscussions(bookId: string, chapter?: number): Promise<({
        author: {
            id: string;
            username: string;
            avatar: string | null;
            level: number;
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
    deleteDiscussion(discussionId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        chapter: number | null;
        bookId: string;
    }>;
}
