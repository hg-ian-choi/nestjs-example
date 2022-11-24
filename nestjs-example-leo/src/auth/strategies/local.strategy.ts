import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(
    _username: string,
    _password: string,
  ): Promise<{ id: number; username: string }> {
    const user = await this.authService.vaildateUser(_username, _password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
