import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(query: string, req: any): Promise<{
        users: never[];
        clubs: never[];
        books: never[];
        events: never[];
        total?: undefined;
    } | {
        users: {
            id: string;
            username: string;
            avatar: string | null;
            bio: string | null;
            level: number;
            _count: {
                memberships: number;
                followedBy: number;
            };
        }[];
        clubs: ({
            _count: {
                members: number;
            };
        } & {
            id: string;
            city: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isPrivate: boolean;
            creatorId: string;
            currentBookId: string | null;
        })[];
        books: {
            id: string;
            title: string;
            author: string;
            description: string | null;
            categories: string[];
            cover: string | null;
        }[];
        events: ({
            club: {
                id: string;
                name: string;
            };
            _count: {
                rsvps: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            clubId: string;
            date: Date;
            type: import("@prisma/client").$Enums.EventType;
            link: string | null;
            address: string | null;
            locationLat: number | null;
            locationLng: number | null;
            status: import("@prisma/client").$Enums.EventStatus;
            participantLimit: number | null;
            organizerId: string;
        })[];
        total: number;
    }>;
}
