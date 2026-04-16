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
}
