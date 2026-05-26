import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('ranking')
  async getRanking() {
    return this.gamificationService.getGlobalRanking();
  }

  @Get('stats')
  getMyStats(@Request() req: any) {
    return this.gamificationService.getUserStats(req.user.id);
  }

  @Get('stats/:userId')
  getUserStats(@Param('userId') userId: string) {
    return this.gamificationService.getUserStats(userId);
  }
}
