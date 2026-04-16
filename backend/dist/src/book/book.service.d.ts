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
    search(query: string, tags?: string[]): Promise<{
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
    recommendBooks(userId: string): Promise<{
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
}
