import { PrismaService } from '../prisma/prisma.service';
export declare class ReadingListService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserLists(userId: string): Promise<({
        _count: {
            items: number;
        };
        items: ({
            book: {
                id: string;
                title: string;
                author: string;
                categories: string[];
                cover: string | null;
            };
        } & {
            id: string;
            bookId: string;
            addedAt: Date;
            listId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        type: import("@prisma/client").$Enums.ReadingListType;
    })[]>;
    createList(userId: string, data: {
        name: string;
        type?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        type: import("@prisma/client").$Enums.ReadingListType;
    }>;
    addItem(userId: string, listId: string, bookId: string): Promise<{
        book: {
            id: string;
            title: string;
            author: string;
            cover: string | null;
        };
    } & {
        id: string;
        bookId: string;
        addedAt: Date;
        listId: string;
    }>;
    removeItem(userId: string, listId: string, bookId: string): Promise<{
        id: string;
        bookId: string;
        addedAt: Date;
        listId: string;
    }>;
    deleteList(userId: string, listId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        type: import("@prisma/client").$Enums.ReadingListType;
    }>;
    initDefaultLists(userId: string): Promise<void>;
}
