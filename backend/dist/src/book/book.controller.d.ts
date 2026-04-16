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
        externalLink: string | null;
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
        externalLink: string | null;
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
        externalLink: string | null;
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
        externalLink: string | null;
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
        externalLink: string | null;
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
        externalLink: string | null;
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
        externalLink: string | null;
    }>;
}
