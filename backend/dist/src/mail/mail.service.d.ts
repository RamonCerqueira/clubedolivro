import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendMagicLink(email: string, token: string): Promise<void>;
    sendEventReminder(email: string, eventTitle: string, date: string, location: string): Promise<void>;
}
