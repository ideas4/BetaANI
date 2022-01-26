import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionFelController } from './configuracion-fel.controller';
import { ConfiguracionFelService } from './configuracion-fel.service';
import { ConfiguracionFel } from './entities/configuracion-fel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracionFel])],
  controllers: [ConfiguracionFelController],
  providers: [ConfiguracionFelService]
})
export class ConfiguracionFelModule {}
