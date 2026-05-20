import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ReminderProcessor } from './processors/reminder.processor';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    BullModule.registerQueue({
      name: 'reminders',
    }),
  ],
  controllers: [EventController],
  providers: [EventService, ReminderProcessor],
})
export class EventModule {}

