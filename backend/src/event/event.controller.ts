import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() body: CreateEventDto) {
    return this.eventService.createEvent(body.clubId, req.user.id, body);
  }

  @Get()
  findAll(@Request() req: any) {
    const authHeader = req.headers?.authorization;
    let userId: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payloadBase64 = token.split('.')[1];
        if (payloadBase64) {
          const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
          userId = decodedPayload.sub;
        }
      } catch (err) {
        // ignore and treat as unauthenticated
      }
    }
    return this.eventService.findAll(userId);
  }

  @Post(':id/rsvp')
  @UseGuards(JwtAuthGuard)
  rsvp(@Request() req: any, @Param('id') id: string) {
    return this.eventService.rsvp(id, req.user.id);
  }
}
