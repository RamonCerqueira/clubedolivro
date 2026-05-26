import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(req: any): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, body: {
        bio?: string;
        city?: string;
        avatar?: string;
        interests?: string[];
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
        createdAt: Date;
        updatedAt: Date;
    }>;
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
    search(req: any, query: any): Promise<{
        id: string;
        username: string;
        avatar: string | null;
        bio: string | null;
        level: number;
    }[]>;
}
