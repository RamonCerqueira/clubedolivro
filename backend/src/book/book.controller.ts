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
}
