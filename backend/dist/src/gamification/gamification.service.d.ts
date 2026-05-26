import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
export declare class GamificationService {
    private prisma;
    private notificationService;
    private readonly logger;
    constructor(prisma: PrismaService, notificationService: NotificationService);
    addPoints(userId: string, points: number, reason: string): Promise<{
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
    } | undefined>;
    updateStreak(userId: string): Promise<{
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
    } | undefined>;
    checkAndAwardBadges(userId: string): Promise<void>;
    getGlobalRanking(): Promise<{
        username: string;
        avatar: string | null;
        level: number;
        points: number;
        streak: number;
        achievements: {
            title: string;
            type: string;
        }[];
    }[]>;
    getUserStats(userId: string): Promise<{
        level: number;
        points: number;
        streak: number;
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
            posts: number;
            journals: number;
        };
    } | null>;
}
