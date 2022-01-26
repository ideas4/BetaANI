import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentTypeController } from './appointment-type.controller';
import { AppointmentTypeService } from './appointment-type.service';
import { AppointmentType } from './entities/appointment-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentType]), AppointmentTypeModule],
  controllers: [AppointmentTypeController],
  providers: [AppointmentTypeService],
})
export class AppointmentTypeModule {}
