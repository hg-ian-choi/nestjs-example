import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async vaildateUser(
    _username: string,
    _password: string,
  ): Promise<{ id: number; username: string } | null> {
    Logger.verbose('AuthService validateUser()');
    const user = await this.usersService.findByUsername(_username);
    if (!user) {
      throw new ForbiddenException({
        message: [`No User`],
      });
    }
    try {
      await this.verifyPassword(_password, user.password);
      return user;
    } catch (_error) {
      throw new ForbiddenException({
        message: [`Wrong password!`],
      });
    }
  }

  async signIn(_user: User): Promise<any> {
    Logger.verbose('AuthService login()');
    const paylod = { id: _user.id, username: _user.username };
    const token = this.jwtService.sign(paylod);
    return {
      token: token,
      domain: this.configService.get<string>('DOMAIN'),
      path: this.configService.get<string>('PATH'),
      secure: true,
      maxAge: this.configService.get<number>('AT_MAXAGE'),
    };
  }

  async signOut(): Promise<any> {
    return {
      token: '',
      domain: this.configService.get<string>('DOMAIN'),
      path: this.configService.get<string>('PATH'),
      secure: true,
      maxAge: 0,
    };
  }

  async register(_user: User): Promise<any> {
    const hashedPassword = await hash(_user.password, 10);

    try {
      const { password, ...result } = await this.usersService.create({
        ..._user,
        password: hashedPassword,
      });

      return result;
    } catch (_error) {
      throw new ForbiddenException();
    }
  }

  private async verifyPassword(
    _plainTextPassword: string,
    _hashedPassword: string,
  ) {
    const isPasswordMatch = await compare(_plainTextPassword, _hashedPassword);

    if (!isPasswordMatch) {
      throw new ForbiddenException({
        message: [`Wrong password`],
      });
    }
  }
}
