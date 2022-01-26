import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './entities/config.entity';
import { ConfigEcommerce } from '../config-ecommerce/entities/config-ecommerce.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Config,ConfigEcommerce])],
  controllers: [ConfigController],
  providers: [ConfigService]
})
export class ConfigModule {}
