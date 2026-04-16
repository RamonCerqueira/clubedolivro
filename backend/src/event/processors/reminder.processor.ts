import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('reminders')
export class ReminderProcessor extends WorkerHost {
  private readonly logger = new Logger(ReminderProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { eventId } = job.data;
    
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { rsvps: { include: { user: true } } }
    });

    if (!event) return;

    this.logger.log(`Sending reminders for event: ${event.title}`);

    for (const rsvp of event.rsvps) {
      if (rsvp.status === 'CONFIRMED') {
        this.logger.log(`Simulating email to ${rsvp.user.email}: O evento "${event.title}" começa em 1 hora!`);
        // Here we would call MailService to send the actual email
      }
    }
  }
}
