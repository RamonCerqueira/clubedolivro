import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    getRanking(): Promise<{
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
    getMyStats(req: any): Promise<{
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
