import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GoalService } from './goal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clubs/:clubId/goals')
@UseGuards(JwtAuthGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  create(@Param('clubId') clubId: string, @Body() data: { title: string; targetPages: number; endDate: string }) {
    return this.goalService.create(clubId, data);
  }

  @Get()
  findAll(@Param('clubId') clubId: string) {
    return this.goalService.findAllByClub(clubId);
  }

  @Patch(':goalId/progress')
  addProgress(
    @Param('clubId') clubId: string,
    @Param('goalId') goalId: string,
    @Body('pages') pages: number,
  ) {
    return this.goalService.addProgress(clubId, goalId, pages);
  }

  @Delete(':goalId')
  remove(@Param('clubId') clubId: string, @Param('goalId') goalId: string) {
    return this.goalService.remove(clubId, goalId);
  }
}
