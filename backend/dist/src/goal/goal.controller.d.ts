import { GoalService } from './goal.service';
export declare class GoalController {
    private readonly goalService;
    constructor(goalService: GoalService);
    create(clubId: string, data: {
        title: string;
        targetPages: number;
        endDate: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        clubId: string;
        targetPages: number;
        currentPages: number;
        startDate: Date;
        endDate: Date;
    }>;
    findAll(clubId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        clubId: string;
        targetPages: number;
        currentPages: number;
        startDate: Date;
        endDate: Date;
    }[]>;
    addProgress(clubId: string, goalId: string, pages: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        clubId: string;
        targetPages: number;
        currentPages: number;
        startDate: Date;
        endDate: Date;
    }>;
    remove(clubId: string, goalId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        clubId: string;
        targetPages: number;
        currentPages: number;
        startDate: Date;
        endDate: Date;
    }>;
}
