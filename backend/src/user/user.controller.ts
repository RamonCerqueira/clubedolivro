import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@Request() req: any) {
    return this.userService.getProfile(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.getProfile(id);
  }

  @Post('follow/:id')
  async follow(@Request() req: any, @Param('id') id: string) {
    return this.userService.followUser(req.user.id, id);
  }

  @Delete('unfollow/:id')
  async unfollow(@Request() req: any, @Param('id') id: string) {
    return this.userService.unfollowUser(req.user.id, id);
  }

  @Put('profile')
  async updateProfile(@Request() req: any, @Body() body: { bio?: string; city?: string; avatar?: string; interests?: string[] }) {
    return this.userService.update(req.user.id, body);
  }

  @Put('interests')
  async updateInterests(@Request() req: any, @Body('interests') interests: string[]) {
    return this.userService.updateInterests(req.user.id, interests);
  }

  @Get('following/list')
  async getFollowing(@Request() req: any) {
    return this.userService.getFollowing(req.user.id);
  }

  @Get('followers/list')
  async getFollowers(@Request() req: any) {
    return this.userService.getFollowers(req.user.id);
  }

  @Get('search/all')
  async search(@Request() req: any, @Request() query: any) {
    return this.userService.searchUsers(query.query.search || '');
  }
}
