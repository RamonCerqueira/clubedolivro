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
exports.ClubController = void 0;
const common_1 = require("@nestjs/common");
const club_service_1 = require("./club.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ClubController = class ClubController {
    clubService;
    constructor(clubService) {
        this.clubService = clubService;
    }
    create(req, body) {
        return this.clubService.create(req.user.id, body);
    }
    findAll() {
        return this.clubService.findAll();
    }
    findOne(id) {
        return this.clubService.findOne(id);
    }
    createInvite(id) {
        return this.clubService.createInvite(id);
    }
    joinByInvite(req, token) {
        return this.clubService.joinViaInvite(req.user.id, token);
    }
    requestJoin(req, id) {
        return this.clubService.requestToJoin(req.user.id, id);
    }
    handleRequest(req, requestId, status) {
        return this.clubService.handleJoinRequest(req.user.id, requestId, status);
    }
    createGlobalPost(req, content, audioUrl, mediaUrl, mediaType) {
        return this.clubService.createPost(req.user.id, content, undefined, audioUrl, mediaUrl, mediaType);
    }
    createPost(req, id, content, audioUrl, mediaUrl, mediaType) {
        return this.clubService.createPost(req.user.id, content, id === 'global' ? undefined : id, audioUrl, mediaUrl, mediaType);
    }
    getGlobalFeed() {
        return this.clubService.getGlobalFeed();
    }
    getFeed(id) {
        return this.clubService.getFeed(id);
    }
    clapOnPost(req, postId, claps) {
        return this.clubService.clapOnPost(req.user.id, postId, claps);
    }
    addComment(req, postId, content) {
        return this.clubService.addComment(req.user.id, postId, content);
    }
    removeComment(req, commentId) {
        return this.clubService.removeComment(req.user.id, commentId);
    }
};
exports.ClubController = ClubController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/invites'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "createInvite", null);
__decorate([
    (0, common_1.Post)('join-by-invite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "joinByInvite", null);
__decorate([
    (0, common_1.Post)(':id/request-join'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "requestJoin", null);
__decorate([
    (0, common_1.Patch)('requests/:requestId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('requestId')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "handleRequest", null);
__decorate([
    (0, common_1.Post)('posts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('content')),
    __param(2, (0, common_1.Body)('audioUrl')),
    __param(3, (0, common_1.Body)('mediaUrl')),
    __param(4, (0, common_1.Body)('mediaType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "createGlobalPost", null);
__decorate([
    (0, common_1.Post)(':id/posts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('content')),
    __param(3, (0, common_1.Body)('audioUrl')),
    __param(4, (0, common_1.Body)('mediaUrl')),
    __param(5, (0, common_1.Body)('mediaType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)('feed/global'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "getGlobalFeed", null);
__decorate([
    (0, common_1.Get)(':id/feed'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Post)('posts/:postId/react'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)('claps')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "clapOnPost", null);
__decorate([
    (0, common_1.Post)('posts/:postId/comments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "addComment", null);
__decorate([
    (0, common_1.Delete)('posts/comments/:commentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ClubController.prototype, "removeComment", null);
exports.ClubController = ClubController = __decorate([
    (0, common_1.Controller)('clubs'),
    __metadata("design:paramtypes", [club_service_1.ClubService])
], ClubController);
//# sourceMappingURL=club.controller.js.map