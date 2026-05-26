import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
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
    private configService: ConfigService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // ─── Core token generation ────────────────────────────────────────────────

  private async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET') + '_refresh',
    });

    // Store access token session in Redis (15 min TTL)
    await this.cacheManager.set(`session:${user.id}:${accessToken}`, 'active', 15 * 60 * 1000);
    // Store refresh token in Redis (7 days TTL)
    await this.cacheManager.set(`refresh:${user.id}:${refreshToken}`, 'active', 7 * 24 * 60 * 60 * 1000);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  // ─── Auth methods ─────────────────────────────────────────────────────────

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    return this.generateTokens(user);
  }

  async register(data: Prisma.UserCreateInput) {
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;
    const user = await this.userService.create({
      ...data,
      password: hashedPassword,
    });
    return this.generateTokens(user);
  }

  async validateOAuthUser(profile: any) {
    let user = await this.userService.findByEmail(profile.email);

    if (!user) {
      // Generate unique username
      const baseUsername = profile.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
      const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
      const username = `${baseUsername}${randomSuffix}`;

      user = await this.userService.create({
        email: profile.email,
        username,
        avatar: profile.picture,
      });
    }

    return this.generateTokens(user);
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET') + '_refresh',
      });

      // Check if refresh token is still valid in Redis
      const isValid = await this.cacheManager.get(`refresh:${payload.sub}:${refreshToken}`);
      if (!isValid) {
        throw new UnauthorizedException('Refresh token inválido ou expirado');
      }

      // Check if user was globally logged out after this token was issued
      const logoutTimestamp = await this.cacheManager.get<number>(`logout:${payload.sub}`);
      if (logoutTimestamp && payload.iat * 1000 < logoutTimestamp) {
        throw new UnauthorizedException('Sessão revogada');
      }

      const user = await this.userService.findByEmail(payload.email);
      if (!user) throw new UnauthorizedException('Usuário não encontrado');

      // Issue new access token only (keep the same refresh token)
      const accessPayload = { email: user.email, sub: user.id };
      const newAccessToken = this.jwtService.sign(accessPayload, { expiresIn: '15m' });
      await this.cacheManager.set(`session:${user.id}:${newAccessToken}`, 'active', 15 * 60 * 1000);

      return { access_token: newAccessToken };
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  // ─── Magic Link ───────────────────────────────────────────────────────────

  async sendMagicLink(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const token = this.jwtService.sign({ email, sub: user.id }, { expiresIn: '15m' });
    await this.mailService.sendMagicLink(email, token);
    return { message: 'Magic link enviado com sucesso' };
  }

  async validateMagicToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findByEmail(payload.email);
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user);
    } catch (e) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  // ─── Logout Global ────────────────────────────────────────────────────────

  async logoutGlobal(userId: string) {
    // Store logout timestamp — JwtStrategy will reject any token issued before this
    await this.cacheManager.set(`logout:${userId}`, Date.now(), 8 * 24 * 60 * 60 * 1000);
    return { message: 'Desconectado de todos os dispositivos' };
  }
}
