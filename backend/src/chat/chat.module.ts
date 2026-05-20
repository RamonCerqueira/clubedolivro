import { Module, forwardRef } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatController } from './chat.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, forwardRef(() => NotificationModule)],
  providers: [ChatService],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
