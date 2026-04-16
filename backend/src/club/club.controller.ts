import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ClubService } from './club.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clubs')
@UseGuards(JwtAuthGuard)
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.clubService.create(req.user.id, body);
  }

  @Get()
  findAll() {
    return this.clubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubService.findOne(id);
  }

  // Invites
  @Post(':id/invites')
  createInvite(@Param('id') id: string) {
    return this.clubService.createInvite(id);
  }

  @Post('join-by-invite')
  joinByInvite(@Request() req: any, @Body('token') token: string) {
    return this.clubService.joinViaInvite(req.user.id, token);
  }

  // Requests
  @Post(':id/request-join')
  requestJoin(@Request() req: any, @Param('id') id: string) {
    return this.clubService.requestToJoin(req.user.id, id);
  }

  @Patch('requests/:requestId')
  handleRequest(
    @Request() req: any,
    @Param('requestId') requestId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED'
  ) {
    return this.clubService.handleJoinRequest(req.user.id, requestId, status);
  }

  // Feed
  @Post('posts')
  createGlobalPost(@Request() req: any, @Body('content') content: string) {
    return this.clubService.createPost(req.user.id, undefined, content);
  }

  @Post(':id/posts')
  createPost(@Request() req: any, @Param('id') id: string, @Body('content') content: string) {
    return this.clubService.createPost(req.user.id, id === 'global' ? undefined : id, content);
  }

  @Get('feed/global')
  getGlobalFeed() {
    return this.clubService.getGlobalFeed();
  }

  @Get(':id/feed')
  getFeed(@Param('id') id: string) {
    return this.clubService.getFeed(id);
  }
}
