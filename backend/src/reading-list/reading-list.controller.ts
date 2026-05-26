import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReadingListService } from './reading-list.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reading-lists')
@UseGuards(JwtAuthGuard)
export class ReadingListController {
  constructor(private readonly readingListService: ReadingListService) {}

  @Get()
  getMyLists(@Request() req: any) {
    return this.readingListService.getUserLists(req.user.id);
  }

  @Get(':userId/public')
  getUserLists(@Param('userId') userId: string) {
    return this.readingListService.getUserLists(userId);
  }

  @Post()
  createList(@Request() req: any, @Body() body: { name: string; type?: string }) {
    return this.readingListService.createList(req.user.id, body);
  }

  @Post(':listId/items')
  addItem(
    @Request() req: any,
    @Param('listId') listId: string,
    @Body('bookId') bookId: string,
  ) {
    return this.readingListService.addItem(req.user.id, listId, bookId);
  }

  @Delete(':listId/items/:bookId')
  removeItem(
    @Request() req: any,
    @Param('listId') listId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.readingListService.removeItem(req.user.id, listId, bookId);
  }

  @Delete(':listId')
  deleteList(@Request() req: any, @Param('listId') listId: string) {
    return this.readingListService.deleteList(req.user.id, listId);
  }
}
