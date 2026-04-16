"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const prisma_service_1 = require("../prisma/prisma.service");
let GeolocationService = class GeolocationService {
    configService;
    prisma;
    client;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.client = new google_maps_services_js_1.Client({});
    }
    async getCoordinatesFromAddress(address) {
        const response = await this.client.geocode({
            params: {
                address: address,
                key: this.configService.get('GOOGLE_MAPS_API_KEY'),
            },
        });
        if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry.location;
            return { lat, lng };
        }
        return null;
    }
    async findNearbyEvents(lat, lng, radiusKm = 10) {
        const latDelta = radiusKm / 111.32;
        const lngDelta = radiusKm / (111.32 * Math.cos(lat * (Math.PI / 180)));
        return this.prisma.event.findMany({
            where: {
                locationLat: {
                    gte: lat - latDelta,
                    lte: lat + latDelta,
                },
                locationLng: {
                    gte: lng - lngDelta,
                    lte: lng + lngDelta,
                },
                status: 'CONFIRMED',
            },
            include: { club: true },
        });
    }
    async findNearbyClubs(city) {
        return this.prisma.club.findMany({
            where: {
                city: { contains: city, mode: 'insensitive' },
            },
            include: { _count: { select: { members: true } } },
        });
    }
};
exports.GeolocationService = GeolocationService;
exports.GeolocationService = GeolocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], GeolocationService);
//# sourceMappingURL=geolocation.service.js.map