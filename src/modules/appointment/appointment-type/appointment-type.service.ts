import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentTypeDto } from './dto/create-appointment-type.dto';
import { UpdateAppointmentTypeDto } from './dto/update-appointment-type.dto';
import { AppointmentType } from './entities/appointment-type.entity';

@Injectable()
export class AppointmentTypeService {
  constructor(
    @InjectRepository(AppointmentType)
    private repositoryAppointmentType: Repository<AppointmentType>,
  ) {}

  async create(createAppointmentTypeDto: CreateAppointmentTypeDto) {
    if (
      !(await this.repositoryAppointmentType.findOne({
        nombre: createAppointmentTypeDto.nombre,
      }))
    ) {
      return this.repositoryAppointmentType.save(createAppointmentTypeDto);
    } else {
      throw new HttpException(
        'El tipo de cita ya existe.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  findAll() {
    return this.repositoryAppointmentType.find();
  }

  findOne(id: number) {
    return this.repositoryAppointmentType.findOne(id);
  }

  async update(id: number, updateAppointmentTypeDto: UpdateAppointmentTypeDto) {
    const inst = await this.repositoryAppointmentType.findOne({
      nombre: updateAppointmentTypeDto.nombre,
    });
    if (!inst || inst.idTipoCita == id) {
      return (
        await this.repositoryAppointmentType.update(
          id,
          updateAppointmentTypeDto,
        )
      ).affected;
    } else {
      throw new HttpException(
        'El tipo de cita ya existe.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async remove(id: number) {
    return (await this.repositoryAppointmentType.delete(id)).affected;
  }
}
