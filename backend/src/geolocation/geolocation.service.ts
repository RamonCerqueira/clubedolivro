import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@googlemaps/google-maps-services-js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeolocationService {
  private client: Client;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.client = new Client({});
  }

  async getCoordinatesFromAddress(address: string) {
    const response = await this.client.geocode({
      params: {
        address: address,
        key: this.configService.get('GOOGLE_MAPS_API_KEY')!,
      },
    });

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    }
    return null;
  }

  async findNearbyEvents(lat: number, lng: number, radiusKm: number = 10) {
    // 1 degree is roughly 111km
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

  async findNearbyClubs(city: string) {
    return this.prisma.club.findMany({
      where: {
        city: { contains: city, mode: 'insensitive' },
      },
      include: { _count: { select: { members: true } } },
    });
  }
}
