import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { Prisma } from '@prisma/client';
export declare class AuthService {
    private userService;
    private jwtService;
    private configService;
    private mailService;
    private cacheManager;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService, mailService: MailService, cacheManager: Cache);
    private generateTokens;
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    register(data: Prisma.UserCreateInput): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    validateOAuthUser(profile: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    sendMagicLink(email: string): Promise<{
        message: string;
    }>;
    validateMagicToken(token: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logoutGlobal(userId: string): Promise<{
        message: string;
    }>;
}
