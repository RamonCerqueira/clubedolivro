import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { BookService } from './book.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('books')
@UseGuards(JwtAuthGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() data: Prisma.BookCreateInput) {
    return this.bookService.create(data);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string, @Query('tags') tags?: string) {
    const tagList = tags ? tags.split(',') : [];
    return this.bookService.search(query || '', tagList);
  }

  @Get('recommendations')
  recommendations(@Request() req: any) {
    return this.bookService.recommendBooks(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.BookUpdateInput) {
    return this.bookService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }

  // ─── Discussões de Livros ─────────────────────────────────────────────────

  @Post(':id/discussions')
  createDiscussion(
    @Param('id') bookId: string,
    @Request() req: any,
    @Body() body: { content: string; chapter?: number },
  ) {
    return this.bookService.createDiscussion(bookId, req.user.id, body);
  }

  @Get(':id/discussions')
  getDiscussions(
    @Param('id') bookId: string,
    @Query('chapter') chapter?: string,
  ) {
    return this.bookService.getDiscussions(bookId, chapter ? parseInt(chapter) : undefined);
  }

  @Delete('discussions/:discussionId')
  deleteDiscussion(@Param('discussionId') discussionId: string, @Request() req: any) {
    return this.bookService.deleteDiscussion(discussionId, req.user.id);
  }
}
