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
        type: 'club' | 'event';
    }): Promise<void>;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): void;
}
