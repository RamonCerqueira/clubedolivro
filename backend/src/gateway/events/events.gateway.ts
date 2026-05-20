import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { ChatService } from '../../chat/chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  constructor(
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
  ) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    client.join(data.roomId);
    this.logger.log(`Client ${client.id} joined room ${data.roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    client.leave(data.roomId);
    this.logger.log(`Client ${client.id} left room ${data.roomId}`);
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string, userId: string, content: string, type: 'club' | 'event' | 'direct', receiverId?: string }
  ) {
    const clubId = data.type === 'club' ? data.roomId : undefined;
    const eventId = data.type === 'event' ? data.roomId : undefined;
    const receiverId = data.type === 'direct' ? data.receiverId : undefined;

    const message = await this.chatService.saveMessage(data.userId, data.content, clubId, eventId, receiverId);
    
    this.server.to(data.roomId).emit('msgToClient', message);
  }

  @SubscribeMessage('joinAudioRoom')
  handleJoinAudioRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string, userId: string, username: string }) {
    client.join(`audio-${data.roomId}`);
    client.to(`audio-${data.roomId}`).emit('userJoinedAudio', {
      socketId: client.id,
      userId: data.userId,
      username: data.username,
    });
    this.logger.log(`User ${data.username} (${client.id}) joined audio room: audio-${data.roomId}`);
  }

  @SubscribeMessage('leaveAudioRoom')
  handleLeaveAudioRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string, userId: string }) {
    client.leave(`audio-${data.roomId}`);
    client.to(`audio-${data.roomId}`).emit('userLeftAudio', {
      socketId: client.id,
      userId: data.userId,
    });
    this.logger.log(`User ${data.userId} left audio room: audio-${data.roomId}`);
  }

  @SubscribeMessage('audioSignal')
  handleAudioSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { toSocketId: string, signal: any, userId: string, username: string }
  ) {
    this.server.to(data.toSocketId).emit('audioSignalReceived', {
      fromSocketId: client.id,
      signal: data.signal,
      userId: data.userId,
      username: data.username,
    });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
