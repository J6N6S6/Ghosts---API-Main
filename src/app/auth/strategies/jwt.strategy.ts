import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface UserFromJwt {
  user_id: string;
  email: string;
  secret: string;
}

interface PayloadProp {
  user_id: string;
  email: string;
  secret: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadProp): Promise<UserFromJwt> {
    return {
      ...payload,
      email: payload.email,
      user_id: payload.user_id,
      secret: payload.secret,
    };
  }
}
