import { Controller, Post, Get, Body, UnauthorizedException, Request, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard'; // I'll create this or use a generic one
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@Throttle({ geral: { limit: 5, ttl: 60000 } })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register({
      email: body.email,
      password: body.password,
      username: body.username,
      city: body.city,
    });
  }

  // Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req) {
    return this.authService.validateOAuthUser(req.user);
  }

  // Facebook OAuth
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Request() req) {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Request() req) {
    return this.authService.validateOAuthUser(req.user);
  }

  // Magic Link
  @Post('magic-link')
  async sendMagicLink(@Body('email') email: string) {
    return this.authService.sendMagicLink(email);
  }

  @Get('magic-login')
  async magicLogin(@Query('token') token: string) {
    return this.authService.validateMagicToken(token);
  }

  // Refresh Token
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token não fornecido');
    return this.authService.refreshAccessToken(refreshToken);
  }

  // Logout
  @Post('logout-global')
  @UseGuards(AuthGuard('jwt'))
  async logoutGlobal(@Request() req) {
    return this.authService.logoutGlobal(req.user.id);
  }
}
