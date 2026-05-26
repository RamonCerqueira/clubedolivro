import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Controller, Get } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Helmet de segurança HTTP
  app.use(helmet());

  // CORS explícito — permite frontend web e mobile
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8081',
      process.env.FRONTEND_URL || 'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
    credentials: true,
  });

  // Ensure uploads directory exists
  const uploadsDir = join(__dirname, '..', 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve static assets
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
  });

  // Habilita validação global estrita
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro de exceção global para formatar retornos de erro com segurança
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 Leituri API running on: http://localhost:${process.env.PORT ?? 3001}`);
  console.log(`❤️  Health check: http://localhost:${process.env.PORT ?? 3001}/health`);
}
bootstrap();
