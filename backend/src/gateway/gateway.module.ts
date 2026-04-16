import { Module } from '@nestjs/common';
import { EventsGateway } from './events/events.gateway';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule],
  providers: [EventsGateway],
  exports: [EventsGateway], // 🔥 FALTAVA ISSO
})
export class GatewayModule {}