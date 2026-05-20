import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/mail.service';

@Processor('reminders')
export class ReminderProcessor extends WorkerHost {
  private readonly logger = new Logger(ReminderProcessor.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {
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
        this.logger.log(`Sending actual reminder email to ${rsvp.user.email} for event "${event.title}"`);
        try {
          const dateStr = event.date ? new Date(event.date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : 'Horário não definido';
          const locationStr = event.address || event.link || 'Online';
          await this.mailService.sendEventReminder(
            rsvp.user.email,
            event.title,
            dateStr,
            locationStr
          );
        } catch (error) {
          this.logger.error(`Failed to send email to ${rsvp.user.email}: ${error.message}`);
        }
      }
    }
  }
}

