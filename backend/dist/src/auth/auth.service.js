"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const cache_manager_1 = require("@nestjs/cache-manager");
const user_service_1 = require("../user/user.service");
const mail_service_1 = require("../mail/mail.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    userService;
    jwtService;
    mailService;
    cacheManager;
    constructor(userService, jwtService, mailService, cacheManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.cacheManager = cacheManager;
    }
    async validateUser(email, pass) {
        const user = await this.userService.findByEmail(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload);
        await this.cacheManager.set(`session:${user.id}:${accessToken}`, 'active', 86400 * 1000);
        return {
            access_token: accessToken,
        };
    }
    async register(data) {
        const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;
        const user = await this.userService.create({
            ...data,
            password: hashedPassword,
        });
        return this.login(user);
    }
    async validateOAuthUser(profile) {
        let user = await this.userService.findByEmail(profile.email);
        if (!user) {
            user = await this.userService.create({
                email: profile.email,
                username: profile.email.split('@')[0] + Math.floor(Math.random() * 1000),
                avatar: profile.picture,
            });
        }
        return this.login(user);
    }
    async sendMagicLink(email) {
        const user = await this.userService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const token = this.jwtService.sign({ email, sub: user.id }, { expiresIn: '15m' });
        await this.mailService.sendMagicLink(email, token);
        return { message: 'Magic link sent' };
    }
    async validateMagicToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userService.findByEmail(payload.email);
            if (!user)
                throw new common_1.UnauthorizedException();
            return this.login(user);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async logoutGlobal(userId) {
        await this.cacheManager.set(`logout:${userId}`, Date.now(), 86400 * 1000);
        return { message: 'Logged out from all devices' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        mail_service_1.MailService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map