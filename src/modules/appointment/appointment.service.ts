import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private repositoryAppointment: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    return await this.repositoryAppointment.save(createAppointmentDto);
  }

  findAll() {
    return this.repositoryAppointment.find();
  }

  findOne(id: number) {
    return this.repositoryAppointment.findOne(id);
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return (await this.repositoryAppointment.update(id, updateAppointmentDto))
      .affected;
  }

  async remove(id: number) {
    return (await this.repositoryAppointment.delete(id)).affected;
  }

  async findAllWithColor() {
    const query = `Select cita.id, cita.title, cita.description, cita.start, cita.end, cita.idCliente, cita.idTipoCita, tc.codigo_color as color, c.nombre_completo as nombre from cita
    inner join tipo_cita tc on cita.idTipoCita = tc.idTipoCita
    inner join cliente c on cita.idCliente = c.id;`;
    return await this.repositoryAppointment.query(query);
  }
}
