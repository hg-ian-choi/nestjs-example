import {
  Body,
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
  @Post('signin')
  async signIn(
    @GetUser() _user: User,
    @Res({ passthrough: true }) _res: Response,
  ): Promise<any> {
    Logger.verbose('AuthController login()');
    const { token, ...option } = await this.authService.signIn(_user);
    _res.cookie('w_auth', token, option);
  }

  @Post('signout')
  async signOut(@Res({ passthrough: true }) _res: Response) {
    const { token, ...option } = await this.authService.signOut();
    _res.cookie('w_auth', token, option);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() _req: any): Promise<any> {
    Logger.verbose('AuthController getProfile');
    return _req.user;
  }

  @Public()
  @Post('register')
  async register(@Body() _user: User): Promise<any> {
    return this.authService.register(_user);
  }
}
