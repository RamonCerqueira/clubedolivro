import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Gerando sementes de dados reais...');

  // 1. Limpar banco
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

  // 2. Criar Usuários
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

  // 3. Criar Livros
  const books = [
    { title: 'The Neon Archive', author: 'Cassian Wright', categories: ['Ficção Científica'], description: 'Um mistério cyberpunk em um futuro distópico.' },
    { title: 'O Alienista', author: 'Machado de Assis', categories: ['Clássicos'], description: 'A loucura sob a ótica da ciência.' },
    { title: 'Matéria Escura', author: 'Blake Crouch', categories: ['Suspense', 'Ficção Científica'], description: 'Um thriller sobre física quântica e escolhas.' },
    { title: 'Dom Casmurro', author: 'Machado de Assis', categories: ['Clássicos'], description: 'Capitu traiu ou não traiu?' },
    { title: 'Duna', author: 'Frank Herbert', categories: ['Ficção Científica', 'Fantasia'], description: 'O épico das areias de Arrakis.' },
    { title: 'Solo Leveling - Volume 01', author: 'Chugong', categories: ['Anime & Mangá'], description: 'O despertar do caçador mais fraco da humanidade no portal de rank D.' },
  ];

  for (const book of books) {
    await prisma.book.create({ data: book });
  }

  // 4. Criar Clubes
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

  const club3 = await prisma.club.create({
    data: {
      name: 'Otaku Read & Discuss',
      description: 'O ponto de encontro perfeito para debater mangás, animes, light novels e toda a cultura pop oriental!',
      city: 'São Paulo',
      isPrivate: false,
      creatorId: user1.id,
      members: { create: [{ userId: user1.id, role: 'ADMIN' }, { userId: user2.id, role: 'MEMBER' }] }
    }
  });

  // 5. Criar Posts/Discussões
  await prisma.clubPost.create({
    data: {
      content: 'Alguém já começou a leitura do mês? Achei o primeiro capítulo de Duna denso mas incrível.',
      clubId: club1.id,
      authorId: user1.id
    }
  });

  await prisma.clubPost.create({
    data: {
      content: 'E aí pessoal! Sejam bem-vindos ao Otaku Read & Discuss. O que acharam da leitura do primeiro volume de Solo Leveling? O traço e a evolução do Jin-Woo são fantásticos!',
      clubId: club3.id,
      authorId: user1.id
    }
  });

  // 6. Criar Eventos
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
