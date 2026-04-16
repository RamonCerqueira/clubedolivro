import { GeolocationService } from './geolocation.service';
export declare class GeolocationController {
    private readonly geolocationService;
    constructor(geolocationService: GeolocationService);
    findNearbyEvents(lat: string, lng: string, radius?: string): Promise<({
        club: {
            id: string;
            city: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isPrivate: boolean;
            creatorId: string;
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
    })[]>;
    geocode(address: string): Promise<{
        lat: number;
        lng: number;
    } | null>;
}
