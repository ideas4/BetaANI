import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Config } from '../../modules/configurations/config-admin/entities/config.entity';
import { ConfigEcommerce } from '../../modules/configurations/config-ecommerce/entities/config-ecommerce.entity';
import { Repository } from 'typeorm';
const ID = 1;
@Module({
  providers: [],
  imports: [
    TypeOrmModule.forFeature([Config, ConfigEcommerce]),
    MailerModule.forRootAsync({
      imports: [TypeOrmModule.forFeature([Config])],
      inject: [getRepositoryToken(Config)],
      useFactory: async (mailerRepo: Repository<Config>) => {
        const config: Config = await mailerRepo.findOne(ID);
        console.log('MAIL CONFIG', config);
        return {
          transport: {
            host: config.email_host,
            port: config.email_puerto,
            auth: {
              user: config.email_send_user,
              pass: config.email_send_password,
            },
          },
          defaults: {
            from: config.email_send_user,
          },
          template: {
            dir: 'assets/templates-mail',
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
})
export class SenderMailModule {}
