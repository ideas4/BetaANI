import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersService } from './services/users/users.service';
import { AuthService } from './services/auth/auth.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolUser } from './entities/rol.entity';
import { StatuslUser } from './entities/user-status.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/constants';
import { JwtStrategy } from './services/auth/jwt.strategy';
import { AccessLog } from './entities/access-log.entity';
import { AccessLogService } from './services/access-log.service';
import { SendMailService } from '../../services/mailer/send-mail.service';
import { ConfigService } from '../configurations/config-admin/config.service';
import { ConfigEcommerce } from '../configurations/config-ecommerce/entities/config-ecommerce.entity';
import { Config } from '../configurations/config-admin/entities/config.entity';
import { SenderMailModule } from '../../services/mailer/mailer.module';

@Module({
  imports:[TypeOrmModule.forFeature([User,RolUser,StatuslUser,AccessLog,Config,ConfigEcommerce]),
  JwtModule.register({
    secret: JWT_SECRET,
    signOptions: { expiresIn: '60d' },
  }),
    SenderMailModule
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService,JwtStrategy,AccessLogService,ConfigService,SendMailService]
})
export class UsersModule {}
