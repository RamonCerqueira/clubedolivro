import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('geolocation')
@UseGuards(JwtAuthGuard)
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) {}

  @Get('nearby-events')
  async findNearbyEvents(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.geolocationService.findNearbyEvents(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 10,
    );
  }

  @Get('nearby-clubs')
  async findNearbyClubs(@Query('city') city: string) {
    return this.geolocationService.findNearbyClubs(city);
  }

  @Get('geocode')
  async geocode(@Query('address') address: string) {
    return this.geolocationService.getCoordinatesFromAddress(address);
  }
}
