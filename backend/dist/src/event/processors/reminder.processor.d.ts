import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/mail.service';
export declare class ReminderProcessor extends WorkerHost {
    private prisma;
    private mailService;
    private readonly logger;
    constructor(prisma: PrismaService, mailService: MailService);
    process(job: Job<any, any, string>): Promise<any>;
}
