import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithRequest,
} from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
  private configService: ConfigService,
  @Inject(CACHE_MANAGER) private cacheManager: Cache,
) {
  // pega antes
  const secret = configService.get<string>('JWT_SECRET');

  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: secret as string,
    passReqToCallback: true,
  });
}
  async validate(req: Request, payload: any) {
    // Proteção contra undefined
    const authHeader = req.get('authorization');

    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authHeader.replace('Bearer ', '');

    // Verifica sessão
    const session = await this.cacheManager.get(
      `session:${payload.sub}:${token}`,
    );

    if (!session) {
      throw new UnauthorizedException('Session expired or logged out');
    }

    // Verifica logout global
    const logoutTimestamp = await this.cacheManager.get<number>(
      `logout:${payload.sub}`,
    );

    if (logoutTimestamp && payload.iat * 1000 < logoutTimestamp) {
      throw new UnauthorizedException('Session revoked by global logout');
    }

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}