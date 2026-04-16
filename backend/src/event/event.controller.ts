import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.eventService.createEvent(body.clubId, req.user.id, body);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Post(':id/rsvp')
  rsvp(@Request() req: any, @Param('id') id: string) {
    return this.eventService.rsvp(id, req.user.id);
  }
}
