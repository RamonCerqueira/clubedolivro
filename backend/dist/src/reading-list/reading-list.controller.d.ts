import { ReadingListService } from './reading-list.service';
export declare class ReadingListController {
    private readonly readingListService;
    constructor(readingListService: ReadingListService);
    getMyLists(req: any): Promise<({
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
            listId: string;
            addedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        type: import("@prisma/client").$Enums.ReadingListType;
    })[]>;
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
            listId: string;
            addedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        type: import("@prisma/client").$Enums.ReadingListType;
    })[]>;
    createList(req: any, body: {
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
    addItem(req: any, listId: string, bookId: string): Promise<{
        book: {
            id: string;
            title: string;
            author: string;
            cover: string | null;
        };
    } & {
        id: string;
        bookId: string;
        listId: string;
        addedAt: Date;
    }>;
    removeItem(req: any, listId: string, bookId: string): Promise<{
        id: string;
        bookId: string;
        listId: string;
        addedAt: Date;
    }>;
    deleteList(req: any, listId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        type: import("@prisma/client").$Enums.ReadingListType;
    }>;
}
