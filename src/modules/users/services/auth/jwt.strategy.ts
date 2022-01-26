import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET } from 'src/constants';
import { UsersService } from '../users/users.service';
import { JWTPayload } from '../../dtos/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET
    });
  }

  async validate(payload: JWTPayload): Promise<any> {
    const user = await this.usersService.findOneClear(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {...payload,email:user.email};
  }
}