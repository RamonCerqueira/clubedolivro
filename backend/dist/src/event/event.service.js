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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EventService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const gamification_service_1 = require("../gamification/gamification.service");
let EventService = EventService_1 = class EventService {
    prisma;
    remindersQueue;
    gamificationService;
    logger = new common_1.Logger(EventService_1.name);
    constructor(prisma, remindersQueue, gamificationService) {
        this.prisma = prisma;
        this.remindersQueue = remindersQueue;
        this.gamificationService = gamificationService;
    }
    async createEvent(clubId, organizerId, data) {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentEventsCount = await this.prisma.event.count({
            where: {
                organizerId,
                createdAt: { gte: oneDayAgo }
            }
        });
        if (recentEventsCount >= 2) {
            throw new common_1.BadRequestException('Anti-spam: You can only create 2 events every 24 hours.');
        }
        const club = await this.prisma.club.findUnique({
            where: { id: clubId },
            include: { _count: { select: { members: true } } }
        });
        if (!club)
            throw new common_1.NotFoundException('Club not found');
        if (club._count.members < 5) {
            throw new common_1.BadRequestException('Club must have at least 5 members to create events.');
        }
        const event = await this.prisma.event.create({
            data: {
                title: data.title,
                date: new Date(data.date),
                type: data.type,
                description: data.description,
                club: { connect: { id: clubId } },
                organizer: { connect: { id: organizerId } },
            }
        });
        this.logger.log(`Created new event "${event.title}" (ID: ${event.id}) for club ${clubId} by organizer ${organizerId}`);
        const delay = new Date(event.date).getTime() - Date.now() - (60 * 60 * 1000);
        if (delay > 0) {
            await this.remindersQueue.add('event-reminder', { eventId: event.id }, { delay });
        }
        await this.gamificationService.addPoints(organizerId, 50, 'Organizou um novo evento literário');
        return event;
    }
    async rsvp(eventId, userId) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: { _count: { select: { rsvps: true } } }
        });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        if (event.participantLimit && event._count.rsvps >= event.participantLimit) {
            throw new common_1.BadRequestException('Event is full');
        }
        const existingRsvp = await this.prisma.eventRsvp.findUnique({
            where: { eventId_userId: { eventId, userId } }
        });
        if (existingRsvp) {
            throw new common_1.BadRequestException('User already RSVPd');
        }
        const rsvp = await this.prisma.eventRsvp.create({
            data: {
                event: { connect: { id: eventId } },
                user: { connect: { id: userId } },
                status: 'CONFIRMED'
            }
        });
        this.logger.log(`User ${userId} RSVP'd successfully to event "${event.title}" (ID: ${eventId})`);
        await this.gamificationService.addPoints(userId, 20, 'Confirmou presença em evento');
        const rsvpCount = await this.prisma.eventRsvp.count({
            where: { eventId, status: 'CONFIRMED' }
        });
        if (rsvpCount >= 3 && event.status === 'DRAFT') {
            await this.prisma.event.update({
                where: { id: eventId },
                data: { status: 'CONFIRMED' }
            });
        }
        return rsvp;
    }
    async findAll(userId) {
        const whereClause = {
            club: {
                OR: [
                    { isPrivate: false },
                    ...(userId ? [{
                            members: {
                                some: {
                                    userId: userId
                                }
                            }
                        }] : [])
                ]
            }
        };
        return this.prisma.event.findMany({
            where: whereClause,
            include: { club: true, organizer: true, _count: { select: { rsvps: true } } }
        });
    }
};
exports.EventService = EventService;
exports.EventService = EventService = EventService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('reminders')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue,
        gamification_service_1.GamificationService])
], EventService);
//# sourceMappingURL=event.service.js.map