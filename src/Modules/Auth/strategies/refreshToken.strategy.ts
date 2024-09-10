import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { IUserRequest } from '../../common/interfaces/requestType.interface';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: IUserRequest, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    req.user = { ...payload, refreshToken };
    return req.user;
  }
}
