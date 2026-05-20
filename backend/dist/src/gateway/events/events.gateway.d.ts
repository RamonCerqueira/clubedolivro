import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../../chat/chat.service';
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    server: Server;
    private logger;
    constructor(chatService: ChatService);
    handleJoinRoom(client: Socket, data: {
        roomId: string;
    }): void;
    handleLeaveRoom(client: Socket, data: {
        roomId: string;
    }): void;
    handleMessage(client: Socket, data: {
        roomId: string;
        userId: string;
        content: string;
        type: 'club' | 'event' | 'direct';
        receiverId?: string;
    }): Promise<void>;
    handleJoinAudioRoom(client: Socket, data: {
        roomId: string;
        userId: string;
        username: string;
    }): void;
    handleLeaveAudioRoom(client: Socket, data: {
        roomId: string;
        userId: string;
    }): void;
    handleAudioSignal(client: Socket, data: {
        toSocketId: string;
        signal: any;
        userId: string;
        username: string;
    }): void;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
}
