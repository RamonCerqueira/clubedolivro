import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClubModule } from './club/club.module';
import { EventModule } from './event/event.module';
import { GatewayModule } from './gateway/gateway.module';
import { MailModule } from './mail/mail.module';
import { BookModule } from './book/book.module';
import { GeolocationModule } from './geolocation/geolocation.module';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';
import { GamificationModule } from './gamification/gamification.module';
import { JournalModule } from './journal/journal.module';
import { GoalModule } from './goal/goal.module';
import { UploadModule } from './upload/upload.module';
import { SearchModule } from './search/search.module';
import { ReadingListModule } from './reading-list/reading-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          maxRetriesPerRequest: null,
          enableOfflineQueue: true,
          retryStrategy: (times) => {
            // Keep retrying in the background to prevent crash
            if (times === 1) {
              console.warn('⚠️ BullMQ failed to connect to Redis. Retrying in background...');
            }
            return Math.min(times * 500, 5000); // retry with exponential backoff up to 5s
          }
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        try {
          const store = await redisStore({
            socket: {
              host: configService.get<string>('REDIS_HOST', 'localhost'),
              port: configService.get<number>('REDIS_PORT', 6379),
            },
          });
          if (store.client) {
            store.client.on('error', (err: any) => {
              // Gracefully handle client errors without crashing
              console.warn('⚠️ Redis Client connection error:', err.message);
            });
          }
          return { store };
        } catch (error: any) {
          console.warn('⚠️ Redis is not running locally. Falling back to in-memory cache store.', error.message);
          return {}; // Falls back to default in-memory cache
        }
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'geral',
        ttl: 60000,
        limit: 30,
      }
    ]),
    PrismaModule, 
    UserModule, 
    AuthModule,
    ClubModule,
    EventModule,
    GatewayModule,
    MailModule,
    BookModule,
    GeolocationModule,
    ChatModule,
    NotificationModule,
    GamificationModule,
    JournalModule,
    GoalModule,
    UploadModule,
    SearchModule,
    ReadingListModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

