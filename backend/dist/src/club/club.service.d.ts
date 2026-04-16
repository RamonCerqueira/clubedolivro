import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
import { GamificationService } from '../gamification/gamification.service';
export declare class ClubService {
    private prisma;
    private notificationService;
    private gamificationService;
    constructor(prisma: PrismaService, notificationService: NotificationService, gamificationService: GamificationService);
    create(creatorId: string, data: Partial<Prisma.ClubCreateInput>): Promise<{
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
    createInvite(clubId: string): Promise<{
        id: string;
        createdAt: Date;
        clubId: string;
        token: string;
        expiresAt: Date | null;
    }>;
    joinViaInvite(userId: string, token: string): Promise<{
        id: string;
        createdAt: Date;
        role: import("@prisma/client").$Enums.Role;
        userId: string;
        clubId: string;
    }>;
    requestToJoin(userId: string, clubId: string): Promise<{
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
    handleJoinRequest(operatorId: string, requestId: string, status: 'APPROVED' | 'REJECTED'): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        clubId: string;
        status: import("@prisma/client").$Enums.RequestStatus;
    }>;
    createPost(userId: string, clubId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        clubId: string;
        authorId: string;
    }>;
    getFeed(clubId: string): Promise<({
        author: {
            username: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        clubId: string;
        authorId: string;
    })[]>;
}
