import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class GeolocationService {
    private configService;
    private prisma;
    private client;
    constructor(configService: ConfigService, prisma: PrismaService);
    getCoordinatesFromAddress(address: string): Promise<{
        lat: number;
        lng: number;
    } | null>;
    findNearbyEvents(lat: number, lng: number, radiusKm?: number): Promise<({
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
    })[]>;
    findNearbyClubs(city: string): Promise<({
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
}
