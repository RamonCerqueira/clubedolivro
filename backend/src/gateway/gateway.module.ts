import { Module, forwardRef } from '@nestjs/common';
import { EventsGateway } from './events/events.gateway';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [forwardRef(() => ChatModule)],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class GatewayModule {}