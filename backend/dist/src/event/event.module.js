"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const event_service_1 = require("./event.service");
const event_controller_1 = require("./event.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const reminder_processor_1 = require("./processors/reminder.processor");
const mail_module_1 = require("../mail/mail.module");
let EventModule = class EventModule {
};
exports.EventModule = EventModule;
exports.EventModule = EventModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            mail_module_1.MailModule,
            bullmq_1.BullModule.registerQueue({
                name: 'reminders',
            }),
        ],
        controllers: [event_controller_1.EventController],
        providers: [event_service_1.EventService, reminder_processor_1.ReminderProcessor],
    })
], EventModule);
//# sourceMappingURL=event.module.js.map