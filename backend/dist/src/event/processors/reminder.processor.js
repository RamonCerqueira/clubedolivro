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
var ReminderProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReminderProcessor = ReminderProcessor_1 = class ReminderProcessor extends bullmq_1.WorkerHost {
    prisma;
    logger = new common_1.Logger(ReminderProcessor_1.name);
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    async process(job) {
        const { eventId } = job.data;
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: { rsvps: { include: { user: true } } }
        });
        if (!event)
            return;
        this.logger.log(`Sending reminders for event: ${event.title}`);
        for (const rsvp of event.rsvps) {
            if (rsvp.status === 'CONFIRMED') {
                this.logger.log(`Simulating email to ${rsvp.user.email}: O evento "${event.title}" começa em 1 hora!`);
            }
        }
    }
};
exports.ReminderProcessor = ReminderProcessor;
exports.ReminderProcessor = ReminderProcessor = ReminderProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('reminders'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReminderProcessor);
//# sourceMappingURL=reminder.processor.js.map