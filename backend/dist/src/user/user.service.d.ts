import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
export declare class UserService {
    private prisma;
    private notificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    findOne(id: string): Promise<{
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
    findByEmail(email: string): Promise<{
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
    } | null>;
    create(data: Prisma.UserCreateInput): Promise<{
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
    update(id: string, data: Prisma.UserUpdateInput): Promise<{
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
    followUser(followerId: string, followingId: string): Promise<{
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
    unfollowUser(followerId: string, followingId: string): Promise<{
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
    updateInterests(id: string, interests: string[]): Promise<{
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
    getProfile(id: string, viewerId?: string): Promise<{
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
    getFollowing(userId: string): Promise<{
        id: string;
        username: string;
        email: string;
        avatar: string | null;
        bio: string | null;
        level: number;
    }[]>;
    getFollowers(userId: string): Promise<{
        id: string;
        username: string;
        email: string;
        avatar: string | null;
        bio: string | null;
        level: number;
    }[]>;
    searchUsers(query: string): Promise<{
        id: string;
        username: string;
        avatar: string | null;
        bio: string | null;
        level: number;
    }[]>;
    getUserStatistics(id: string): Promise<{
        totalPagesRead: number;
        booksReadCount: number;
        favoriteCategories: string[];
    }>;
    getRecommendations(userId: string): Promise<{
        id: string;
        username: string;
        avatar: string | null;
        bio: string | null;
        interests: string[];
    }[]>;
    getUserActivity(id: string): Promise<({
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
}
