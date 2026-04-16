"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Gerando sementes de dados reais...');
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.clubPost.deleteMany();
    await prisma.eventRsvp.deleteMany();
    await prisma.event.deleteMany();
    await prisma.clubMember.deleteMany();
    await prisma.clubJoinRequest.deleteMany();
    await prisma.club.deleteMany();
    await prisma.bookDiscussion.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();
    const password = await bcrypt.hash('123456', 10);
    const user1 = await prisma.user.create({
        data: {
            username: 'ramonfontes',
            email: 'ramon@example.com',
            password,
            city: 'São Paulo',
            level: 12,
            points: 3850,
            streak: 15,
            interests: ['Ficção Científica', 'Tecnologia', 'Clássicos'],
        }
    });
    const user2 = await prisma.user.create({
        data: {
            username: 'alinesouza',
            email: 'aline@example.com',
            password,
            city: 'Rio de Janeiro',
            level: 10,
            points: 2100,
            streak: 5,
            interests: ['Romance', 'Suspense', 'Desenvolvimento Pessoal'],
        }
    });
    const books = [
        { title: 'The Neon Archive', author: 'Cassian Wright', categories: ['Ficção Científica'], description: 'Um mistério cyberpunk em um futuro distópico.' },
        { title: 'O Alienista', author: 'Machado de Assis', categories: ['Clássicos'], description: 'A loucura sob a ótica da ciência.' },
        { title: 'Matéria Escura', author: 'Blake Crouch', categories: ['Suspense', 'Ficção Científica'], description: 'Um thriller sobre física quântica e escolhas.' },
        { title: 'Dom Casmurro', author: 'Machado de Assis', categories: ['Clássicos'], description: 'Capitu traiu ou não traiu?' },
        { title: 'Duna', author: 'Frank Herbert', categories: ['Ficção Científica', 'Fantasia'], description: 'O épico das areias de Arrakis.' },
    ];
    for (const book of books) {
        await prisma.book.create({ data: book });
    }
    const club1 = await prisma.club.create({
        data: {
            name: 'The Cyber Library',
            description: 'Debatendo o futuro e a tecnologia através da literatura.',
            city: 'São Paulo',
            isPrivate: false,
            creatorId: user1.id,
            members: { create: [{ userId: user1.id, role: 'ADMIN' }, { userId: user2.id, role: 'MEMBER' }] }
        }
    });
    const club2 = await prisma.club.create({
        data: {
            name: 'Clássicos Imortais',
            description: 'Onde o tempo não apaga as boas histórias.',
            city: 'Rio de Janeiro',
            isPrivate: true,
            creatorId: user2.id,
            members: { create: [{ userId: user2.id, role: 'ADMIN' }] }
        }
    });
    await prisma.clubPost.create({
        data: {
            content: 'Alguém já começou a leitura do mês? Achei o primeiro capítulo de Duna denso mas incrível.',
            clubId: club1.id,
            authorId: user1.id
        }
    });
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await prisma.event.create({
        data: {
            title: 'Debate: A Loucura em Machado',
            description: 'Encontro para discutir O Alienista.',
            date: nextMonth,
            type: 'PRESENTIAL',
            status: 'CONFIRMED',
            address: 'Av. Paulista, 1000 - São Paulo',
            locationLat: -23.5616,
            locationLng: -46.6560,
            clubId: club1.id,
            organizerId: user1.id,
            rsvps: { create: [{ userId: user1.id, status: 'CONFIRMED' }, { userId: user2.id, status: 'CONFIRMED' }] }
        }
    });
    console.log('✅ Base de dados populada com sucesso!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map