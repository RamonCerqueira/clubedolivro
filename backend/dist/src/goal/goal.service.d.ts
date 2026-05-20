import { PrismaService } from '../prisma/prisma.service';
export declare class GoalService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findAllByClub(clubId: string): Promise<{
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
    remove(clubId: string, id: string): Promise<{
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
