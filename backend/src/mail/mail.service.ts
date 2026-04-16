import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMagicLink(email: string, token: string) {
    const url = `http://localhost:3000/auth/magic-login?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Seu link de acesso ao Clube do Livro',
      html: `<p>Clique no link abaixo para entrar:</p><a href="${url}">${url}</a>`,
    });
  }
}
