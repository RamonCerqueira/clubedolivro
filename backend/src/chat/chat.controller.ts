import { Controller, Get, Post, Body, Query, UseGuards, Request, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('chat')
@UseGuards(JwtAuthGuard)
@Throttle({ geral: { limit: 100, ttl: 60000 } })
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history')
  async getHistory(
    @Request() req: any,
    @Query('clubId') clubId?: string,
    @Query('eventId') eventId?: string,
    @Query('receiverId') receiverId?: string,
  ) {
    return this.chatService.getMessages(clubId, eventId, req.user.id, receiverId);
  }

  @Post('message')
  async sendMessage(
    @Request() req: any,
    @Body() body: { content: string, clubId?: string, eventId?: string, receiverId?: string }
  ) {
    return this.chatService.saveMessage(req.user.id, body.content, body.clubId, body.eventId, body.receiverId);
  }

  @Post('discussions')
  async createDiscussion(
    @Request() req: any,
    @Body() body: { bookId: string, content: string, chapter?: number }
  ) {
    return this.chatService.createDiscussion(req.user.id, body.bookId, body.content, body.chapter);
  }

  @Get('discussions/:bookId')
  async getDiscussions(@Param('bookId') bookId: string) {
    return this.chatService.getDiscussions(bookId);
  }
}
