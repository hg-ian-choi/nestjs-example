import {
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/skip-auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from 'src/users/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(
    @GetUser() _user: User,
    @Res({ passthrough: true }) _res: Response,
  ): Promise<any> {
    Logger.verbose('AuthController login()');
    const token = await this.authService.login(_user);
    _res.cookie('w_auth', token, {
      domain: 'localhost',
      path: '/',
      signed: true,
      httpOnly: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() _req: any): Promise<any> {
    Logger.verbose('AuthController getProfile');
    return _req.user;
  }
}
