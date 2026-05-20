"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("../../chat/chat.service");
let EventsGateway = class EventsGateway {
    chatService;
    server;
    logger = new common_1.Logger('EventsGateway');
    constructor(chatService) {
        this.chatService = chatService;
    }
    handleJoinRoom(client, data) {
        client.join(data.roomId);
        this.logger.log(`Client ${client.id} joined room ${data.roomId}`);
    }
    handleLeaveRoom(client, data) {
        client.leave(data.roomId);
        this.logger.log(`Client ${client.id} left room ${data.roomId}`);
    }
    async handleMessage(client, data) {
        const clubId = data.type === 'club' ? data.roomId : undefined;
        const eventId = data.type === 'event' ? data.roomId : undefined;
        const receiverId = data.type === 'direct' ? data.receiverId : undefined;
        const message = await this.chatService.saveMessage(data.userId, data.content, clubId, eventId, receiverId);
        this.server.to(data.roomId).emit('msgToClient', message);
    }
    handleJoinAudioRoom(client, data) {
        client.join(`audio-${data.roomId}`);
        client.to(`audio-${data.roomId}`).emit('userJoinedAudio', {
            socketId: client.id,
            userId: data.userId,
            username: data.username,
        });
        this.logger.log(`User ${data.username} (${client.id}) joined audio room: audio-${data.roomId}`);
    }
    handleLeaveAudioRoom(client, data) {
        client.leave(`audio-${data.roomId}`);
        client.to(`audio-${data.roomId}`).emit('userLeftAudio', {
            socketId: client.id,
            userId: data.userId,
        });
        this.logger.log(`User ${data.userId} left audio room: audio-${data.roomId}`);
    }
    handleAudioSignal(client, data) {
        this.server.to(data.toSocketId).emit('audioSignalReceived', {
            fromSocketId: client.id,
            signal: data.signal,
            userId: data.userId,
            username: data.username,
        });
    }
    afterInit(server) {
        this.logger.log('Init');
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleConnection(client, ...args) {
        this.logger.log(`Client connected: ${client.id}`);
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('msgToServer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinAudioRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleJoinAudioRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveAudioRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLeaveAudioRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('audioSignal'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleAudioSignal", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_service_1.ChatService))),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map