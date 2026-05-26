import { Module } from '@nestjs/common';
import { ReadingListController } from './reading-list.controller';
import { ReadingListService } from './reading-list.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReadingListController],
  providers: [ReadingListService],
  exports: [ReadingListService],
})
export class ReadingListModule {}
