import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../../orders/entities/order.entity';

@Entity('tarjeta_credito')
export class CreditCard {

  @PrimaryGeneratedColumn()
  id:number;

  @Column({type:'datetime'})
  fecha:Date;

  @Column()
  no_aprobacion:string;

  @Column()
  pos:number;

  @Column()
  monto:number;

  @Column({type:'text'})
  nota:string;

  @ManyToOne(()=>Order)
  @JoinColumn({name:'orden_id'})
  orden:Order;
}
