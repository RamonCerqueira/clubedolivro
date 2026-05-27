import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(req: any): Promise<{
        isFollowing: boolean;
        isFollowedBy: boolean;
        memberships: ({
            club: {
                id: string;
                city: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isPrivate: boolean;
                creatorId: string;
                currentBookId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.Role;
            userId: string;
            clubId: string;
        })[];
        achievements: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            userId: string;
            type: string;
            progress: number;
            target: number;
        }[];
        _count: {
            memberships: number;
            organizedEvents: number;
            rsvps: number;
            followedBy: number;
            following: number;
        };
        id: string;
        username: string;
        email: string;
        avatar: string | null;
        bio: string | null;
        city: string | null;
        level: number;
        points: number;
        streak: number;
        lastActivityAt: Date;
        interests: string[];
        instagramUrl: string | null;
        twitterUrl: string | null;
        goodreadsUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    search(req: any, query: any): Promise<{
        id: string;
        username: string;
        avatar: string | null;
        bio: string | null;
        level: number;
    }[]>;
    getFollowing(req: any): Promise<{
        id: string;
        username: string;
        email: string;
        avatar: string | null;
        bio: string | null;
        level: number;
    }[]>;
    getFollowers(req: any): Promise<{
        id: string;
        username: string;
        email: string;
        avatar: string | null;
        bio: string | null;
        level: number;
    }[]>;
    getRecommendations(req: any): Promise<{
        id: string;
        username: string;
        avatar: string | null;
        bio: string | null;
        interests: string[];
    }[]>;
    getActivity(id: string): Promise<({
        type: string;
        date: Date;
        data: {
            club: {
                name: string;
            } | null;
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
        };
    } | {
        type: string;
        date: Date;
        data: {
            event: {
                title: string;
                date: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.RsvpStatus;
            eventId: string;
        };
    } | {
        type: string;
        date: Date;
        data: {
            book: {
                title: string;
                author: string;
            };
            list: {
                type: import("@prisma/client").$Enums.ReadingListType;
            };
        } & {
            id: string;
            bookId: string;
            listId: string;
            addedAt: Date;
        };
    } | {
        type: string;
        date: Date;
        data: {
            id: string;
            createdAt: Date;
            author: string | null;
            userId: string;
            mediaUrl: string | null;
            mediaType: string | null;
            bookTitle: string;
            pagesRead: number;
            feelings: string[];
            notes: string | null;
        };
    })[]>;
    getStatistics(id: string): Promise<{
        totalPagesRead: number;
        booksReadCount: number;
        favoriteCategories: string[];
    }>;
    findOne(req: any, id: string): Promise<{
        isFollowing: boolean;
        isFollowedBy: boolean;
        memberships: ({
            club: {
                id: string;
                city: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isPrivate: boolean;
                creatorId: string;
                currentBookId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            role: import("@prisma/client").$Enums.Role;
            userId: string;
            clubId: string;
        })[];
        achievements: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            userId: string;
            type: string;
            progress: number;
            target: number;
        }[];
        _count: {
            memberships: number;
            organizedEvents: number;
            rsvps: number;
            followedBy: number;
            following: number;
        };
        id: string;
        username: string;
        email: string;
        avatar: string | null;
        bio: string | null;
        city: string | null;
        level: number;
        points: number;
        streak: number;
        lastActivityAt: Date;
        interests: string[];
        instagramUrl: string | null;
        twitterUrl: string | null;
        goodreadsUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    follow(req: any, id: string): Promise<{
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
        instagramUrl: string | null;
        twitterUrl: string | null;
        goodreadsUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    unfollow(req: any, id: string): Promise<{
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
        instagramUrl: string | null;
        twitterUrl: string | null;
        goodreadsUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, body: {
        bio?: string;
        city?: string;
        avatar?: string;
        interests?: string[];
        instagramUrl?: string;
        twitterUrl?: string;
        goodreadsUrl?: string;
    }): Promise<{
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
        instagramUrl: string | null;
        twitterUrl: string | null;
        goodreadsUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateInterests(req: any, interests: string[]): Promise<{
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
        instagramUrl: string | null;
        twitterUrl: string | null;
        goodreadsUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
