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
        currentBookId: string | null;
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
        currentBookId: string | null;
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
        currentBookId: string | null;
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
    createGlobalPost(req: any, content: string, audioUrl?: string, mediaUrl?: string, mediaType?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        audioUrl: string | null;
        mediaUrl: string | null;
        mediaType: string | null;
        clubId: string | null;
        authorId: string;
    }>;
    createPost(req: any, id: string, content: string, audioUrl?: string, mediaUrl?: string, mediaType?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        audioUrl: string | null;
        mediaUrl: string | null;
        mediaType: string | null;
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
        comments: ({
            author: {
                username: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: string;
            postId: string;
        })[];
        reactions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            postId: string;
            claps: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        audioUrl: string | null;
        mediaUrl: string | null;
        mediaType: string | null;
        clubId: string | null;
        authorId: string;
    })[]>;
    getFollowingFeed(req: any): Promise<({
        author: {
            id: string;
            username: string;
            avatar: string | null;
            level: number;
        };
        club: {
            id: string;
            name: string;
        } | null;
        comments: ({
            author: {
                username: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: string;
            postId: string;
        })[];
        reactions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            postId: string;
            claps: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        audioUrl: string | null;
        mediaUrl: string | null;
        mediaType: string | null;
        clubId: string | null;
        authorId: string;
    })[]>;
    getFeed(id: string): Promise<({
        author: {
            username: string;
            avatar: string | null;
        };
        comments: ({
            author: {
                username: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: string;
            postId: string;
        })[];
        reactions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            postId: string;
            claps: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        audioUrl: string | null;
        mediaUrl: string | null;
        mediaType: string | null;
        clubId: string | null;
        authorId: string;
    })[]>;
    clapOnPost(req: any, postId: string, claps: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        postId: string;
        claps: number;
    }>;
    addComment(req: any, postId: string, content: string): Promise<{
        author: {
            username: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
    }>;
    removeComment(req: any, commentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        authorId: string;
        postId: string;
    }>;
    setCurrentBook(req: any, clubId: string, bookId: string | null): Promise<{
        currentBook: {
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
        } | null;
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
    }>;
}
