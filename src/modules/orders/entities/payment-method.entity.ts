import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'metodo_pago' })
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  notas: string;

  @Column({ default: 0 })
  dias_credito: string;
}
