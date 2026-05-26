import { BookService } from './book.service';
import { Prisma } from '@prisma/client';
export declare class BookController {
    private readonly bookService;
    constructor(bookService: BookService);
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
    search(query: string, tags?: string): Promise<{
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
    recommendations(req: any): Promise<{
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
    createDiscussion(bookId: string, req: any, body: {
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
    getDiscussions(bookId: string, chapter?: string): Promise<({
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
    deleteDiscussion(discussionId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        chapter: number | null;
        bookId: string;
    }>;
}
