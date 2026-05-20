import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('journals')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  create(
    @Request() req: any, 
    @Body() data: { 
      bookTitle: string; 
      author?: string; 
      pagesRead: number; 
      feelings: string[]; 
      notes?: string;
      mediaUrl?: string;
      mediaType?: string;
      postToFeed?: boolean;
    }
  ) {
    return this.journalService.create(req.user.id, data);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.journalService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.journalService.findOne(req.user.id, id);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.journalService.remove(req.user.id, id);
  }
}
