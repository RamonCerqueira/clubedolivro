import { ClubService } from './club.service';
export declare class ClubController {
    private readonly clubService;
    constructor(clubService: ClubService);
    create(req: any, body: any): Promise<{
        id: string;
        city: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isPrivate: boolean;
        creatorId: string;
    }>;
    findAll(): Promise<({
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
    })[]>;
    findOne(id: string): Promise<{
        members: ({
            user: {
                id: string;
                username: string;
                email: string;
                password: string | null;
                avatar: string | null;
                bio: string | null;
                city: string | null;
                level: number;
                points: number;
                streak: number;
                lastActivityAt: Date;
                interests: string[];
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.Role;
            userId: string;
            clubId: string;
        })[];
        events: {
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
        }[];
        _count: {
            posts: number;
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
    }>;
    createInvite(id: string): Promise<{
        id: string;
        createdAt: Date;
        clubId: string;
        token: string;
        expiresAt: Date | null;
    }>;
    joinByInvite(req: any, token: string): Promise<{
        id: string;
        createdAt: Date;
        role: import("@prisma/client").$Enums.Role;
        userId: string;
        clubId: string;
    }>;
    requestJoin(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        role: import("@prisma/client").$Enums.Role;
        userId: string;
        clubId: string;
    } | {
        id: string;
        createdAt: Date;
        userId: string;
        clubId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
    }>;
    handleRequest(req: any, requestId: string, status: 'APPROVED' | 'REJECTED'): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        clubId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
    }>;
    createGlobalPost(req: any, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        clubId: string | null;
        authorId: string;
    }>;
    createPost(req: any, id: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        clubId: string | null;
        authorId: string;
    }>;
    getGlobalFeed(): Promise<({
        author: {
            username: string;
            avatar: string | null;
        };
        club: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        clubId: string | null;
        authorId: string;
    })[]>;
    getFeed(id: string): Promise<({
        author: {
            username: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        clubId: string | null;
        authorId: string;
    })[]>;
}
