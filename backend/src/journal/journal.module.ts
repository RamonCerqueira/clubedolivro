import { Module } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ClubModule } from '../club/club.module';

@Module({
  imports: [PrismaModule, ClubModule],
  controllers: [JournalController],
  providers: [JournalService],
  exports: [JournalService],
})
export class JournalModule {}
