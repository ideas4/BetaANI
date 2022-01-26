import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('cita')
export class Appointment {
  //id: string
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description', type: 'longtext', nullable: true })
  description: string;

  @Column({ name: 'start' })
  start: Date;

  @Column({ name: 'end' })
  end: Date;

  @Column({ name: 'idCliente' })
  idCliente: number;

  @Column({ name: 'idTipoCita' })
  idTipoCita: number;

  //idTipo
  //idCliente
}
