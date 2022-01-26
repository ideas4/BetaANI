import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlDteController } from './control-dte.controller';
import { ControlDteService } from './control-dte.service';
import { ControlDte } from './entities/control-dte.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ControlDte])],
  controllers: [ControlDteController],
  providers: [ControlDteService]
})
export class ControlDteModule {}
