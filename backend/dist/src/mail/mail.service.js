"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
let MailService = class MailService {
    mailerService;
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendMagicLink(email, token) {
        const url = `http://localhost:3000/auth/magic-login?token=${token}`;
        await this.mailerService.sendMail({
            to: email,
            subject: 'Seu link de acesso ao Clube do Livro',
            html: `<p>Clique no link abaixo para entrar:</p><a href="${url}">${url}</a>`,
        });
    }
    async sendEventReminder(email, eventTitle, date, location) {
        await this.mailerService.sendMail({
            to: email,
            subject: `Lembrete: Encontro "${eventTitle}" está próximo!`,
            html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; background-color: #0b0b0c; color: #f4f4f5; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 16px; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: #ffffff; font-size: 20px; font-weight: 900; box-shadow: 0 10px 20px rgba(236,72,153,0.3);">
              L
            </div>
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin-top: 16px; letter-spacing: -0.025em;">Sua tribo está te esperando!</h1>
          </div>
          
          <p style="font-size: 15px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px;">
            Olá! Passando para te lembrar que o encontro literário <strong style="color: #ffffff;">"${eventTitle}"</strong> começará em <strong style="color: #ec4899;">1 hora</strong>. Prepare seus insights e junte-se à conversa!
          </p>
          
          <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 24px; border-radius: 16px; margin: 24px 0;">
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #d4d4d8;">📅 <strong style="color: #a78bfa;">Data e Hora:</strong> ${date}</p>
            <p style="margin: 0; font-size: 14px; color: #d4d4d8;">📍 <strong style="color: #a78bfa;">Local:</strong> ${location}</p>
          </div>
          
          <p style="font-size: 14px; line-height: 1.6; color: #71717a; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px; text-align: center;">
            Este é um e-mail transacional enviado automaticamente pelo ecossistema do Clube do Livro.
          </p>
        </div>
      `,
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map