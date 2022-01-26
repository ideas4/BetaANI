import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipo_cita')
export class AppointmentType {
  @PrimaryGeneratedColumn()
  idTipoCita: number;

  @Column({ name: 'nombre' })
  nombre: string;

  @Column({ name: 'codigo_color' })
  codigo_color: string;
}
