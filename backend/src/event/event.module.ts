import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ReminderProcessor } from './processors/reminder.processor';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'reminders',
    }),
  ],
  controllers: [EventController],
  providers: [EventService, ReminderProcessor],
})
export class EventModule {}
