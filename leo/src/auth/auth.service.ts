import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async vaildateUser(
    _username: string,
    _password: string,
  ): Promise<{ id: number; username: string } | null> {
    Logger.verbose('AuthService validateUser()');
    const user = await this.usersService.findByUsername(_username);

    if (user && user.password === _password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(_user: User): Promise<string> {
    Logger.verbose('AuthService login()');
    const token = this.jwtService.sign(_user);
    return token;
  }
}
