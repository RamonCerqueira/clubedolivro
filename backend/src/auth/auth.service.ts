import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    
    // Store in Redis to allow session control
    await this.cacheManager.set(`session:${user.id}:${accessToken}`, 'active', 86400 * 1000); // 1 day
    
    return {
      access_token: accessToken,
    };
  }

  async register(data: Prisma.UserCreateInput) {
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;
    const user = await this.userService.create({
      ...data,
      password: hashedPassword,
    });

    return this.login(user);
  }

  async validateOAuthUser(profile: any) {
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

  async sendMagicLink(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const token = this.jwtService.sign({ email, sub: user.id }, { expiresIn: '15m' });
    await this.mailService.sendMagicLink(email, token);
    return { message: 'Magic link sent' };
  }

  async validateMagicToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findByEmail(payload.email);
      if (!user) throw new UnauthorizedException();
      return this.login(user);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async logoutGlobal(userId: string) {
    // In a real scenario, we would iterate over all keys pattern "session:userId:*" and delete them
    // For simplicity with standard cache-manager, we'll just note it requires a store that supports keys()
    // Or we store a "logout timestamp" on user and check in JwtStrategy
    await this.cacheManager.set(`logout:${userId}`, Date.now(), 86400 * 1000);
    return { message: 'Logged out from all devices' };
  }
}
