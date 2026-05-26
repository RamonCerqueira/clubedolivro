import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch, Delete } from '@nestjs/common';
import { ClubService } from './club.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  createInvite(@Param('id') id: string) {
    return this.clubService.createInvite(id);
  }

  @Post('join-by-invite')
  @UseGuards(JwtAuthGuard)
  joinByInvite(@Request() req: any, @Body('token') token: string) {
    return this.clubService.joinViaInvite(req.user.id, token);
  }

  // Requests
  @Post(':id/request-join')
  @UseGuards(JwtAuthGuard)
  requestJoin(@Request() req: any, @Param('id') id: string) {
    return this.clubService.requestToJoin(req.user.id, id);
  }

  @Patch('requests/:requestId')
  @UseGuards(JwtAuthGuard)
  handleRequest(
    @Request() req: any,
    @Param('requestId') requestId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED'
  ) {
    return this.clubService.handleJoinRequest(req.user.id, requestId, status);
  }

  // Feed
  @Post('posts')
  @UseGuards(JwtAuthGuard)
  createGlobalPost(
    @Request() req: any, 
    @Body('content') content: string, 
    @Body('audioUrl') audioUrl?: string,
    @Body('mediaUrl') mediaUrl?: string,
    @Body('mediaType') mediaType?: string
  ) {
    return this.clubService.createPost(req.user.id, content, undefined, audioUrl, mediaUrl, mediaType);
  }

  @Post(':id/posts')
  @UseGuards(JwtAuthGuard)
  createPost(
    @Request() req: any,
    @Param('id') id: string,
    @Body('content') content: string,
    @Body('audioUrl') audioUrl?: string,
    @Body('mediaUrl') mediaUrl?: string,
    @Body('mediaType') mediaType?: string
  ) {
    return this.clubService.createPost(req.user.id, content, id === 'global' ? undefined : id, audioUrl, mediaUrl, mediaType);
  }

  @Get('feed/global')
  getGlobalFeed() {
    return this.clubService.getGlobalFeed();
  }

  @Get('feed/following')
  @UseGuards(JwtAuthGuard)
  getFollowingFeed(@Request() req: any) {
    return this.clubService.getFollowingFeed(req.user.id);
  }

  @Get(':id/feed')
  getFeed(@Param('id') id: string) {
    return this.clubService.getFeed(id);
  }

  // Reactions & Comments
  @Post('posts/:postId/react')
  @UseGuards(JwtAuthGuard)
  clapOnPost(@Request() req: any, @Param('postId') postId: string, @Body('claps') claps: number) {
    return this.clubService.clapOnPost(req.user.id, postId, claps);
  }

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  addComment(@Request() req: any, @Param('postId') postId: string, @Body('content') content: string) {
    return this.clubService.addComment(req.user.id, postId, content);
  }

  @Delete('posts/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  removeComment(@Request() req: any, @Param('commentId') commentId: string) {
    return this.clubService.removeComment(req.user.id, commentId);
  }

  // Livro Atual do Clube
  @Patch(':id/current-book')
  @UseGuards(JwtAuthGuard)
  setCurrentBook(
    @Request() req: any,
    @Param('id') clubId: string,
    @Body('bookId') bookId: string | null,
  ) {
    return this.clubService.setCurrentBook(req.user.id, clubId, bookId);
  }
}
