import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { Order } from '../../orders/entities/order.entity';
import { PaymentMethod } from '../../orders/entities/payment-method.entity';

@Entity('venta')
export class SaleEntity{

  @PrimaryGeneratedColumn()

  id:number;

  @Column({default:0, type: 'varchar'})
  total:number;

  @Column({type:'datetime'})
  fecha:Date;

  //@Column()
  //tarjeta_id:number;

  @ManyToOne(()=>Store)
  @JoinColumn({name:'sucursal_id'})
  sucursal:Store;

  @ManyToOne(()=>Order)
  @JoinColumn({name:'orden_id'})
  orden:Order;

  @ManyToOne(()=>PaymentMethod)
  @JoinColumn({name:'metodo_pago_id'})
  metodo_pago:PaymentMethod;

}