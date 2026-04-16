import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    getRanking(): Promise<{
        username: string;
        avatar: string | null;
        level: number;
        points: number;
    }[]>;
}
