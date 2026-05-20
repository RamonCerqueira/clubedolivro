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
exports.GoalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GoalService = class GoalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(clubId, data) {
        const club = await this.prisma.club.findUnique({ where: { id: clubId } });
        if (!club)
            throw new common_1.NotFoundException('Clube não encontrado');
        return this.prisma.clubGoal.create({
            data: {
                clubId,
                title: data.title,
                targetPages: data.targetPages,
                endDate: new Date(data.endDate),
            },
        });
    }
    async addProgress(clubId, goalId, pages) {
        const goal = await this.prisma.clubGoal.findFirst({
            where: { id: goalId, clubId },
        });
        if (!goal)
            throw new common_1.NotFoundException('Meta não encontrada no clube informado');
        const updatedGoal = await this.prisma.clubGoal.update({
            where: { id: goalId },
            data: {
                currentPages: {
                    increment: pages,
                },
            },
        });
        return updatedGoal;
    }
    async findAllByClub(clubId) {
        const club = await this.prisma.club.findUnique({ where: { id: clubId } });
        if (!club)
            throw new common_1.NotFoundException('Clube não encontrado');
        return this.prisma.clubGoal.findMany({
            where: { clubId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(clubId, id) {
        const goal = await this.prisma.clubGoal.findFirst({
            where: { id, clubId },
        });
        if (!goal)
            throw new common_1.NotFoundException('Meta não encontrada');
        return this.prisma.clubGoal.delete({
            where: { id },
        });
    }
};
exports.GoalService = GoalService;
exports.GoalService = GoalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GoalService);
//# sourceMappingURL=goal.service.js.map