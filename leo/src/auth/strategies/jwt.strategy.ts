import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (_request) => {
          console.log('_request', _request?.signedCookies?.w_auth);
          return _request?.signedCookies?.w_auth;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(_payload: {
    id: number;
    username: string;
  }): Promise<{ id: number; username: string }> {
    Logger.verbose('JwtStrategy validate()');
    return _payload;
  }
}
