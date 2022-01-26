import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Shipping } from '../../shipping/entities/shipping.entity';
import { DeliveryType } from '../../orders/entities/delivery-type.entity';
import { QuoteStatusEntity } from './quote-status.entity';
import { PaymentMethod } from '../../orders/entities/payment-method.entity';
import { ProductQuoteEntity } from './product-quote.entity';
import { QuoteTimeEntity } from './quote-time.entity';
@Entity({ name: 'cotizacion' })
export class QuoteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha_creacion: Date;

  @Column({ nullable: false, default: '' })
  cliente: string;

  @Column({ nullable: false, default: '' })
  direccion: string;

  @Column({ nullable: false, default: '' })
  telefono: string;

  @Column({ nullable: false, default: '' })
  email: string;

  @Column({ nullable: false, default: '' })
  nit_cliente: string;

  @Column({ nullable: true })
  url_pdf: string;

  @Column({ nullable: true, type: 'text' })
  encabezado_pagina: string;

  @Column({ nullable: true, type: 'text' })
  terminos_pago: string;

  @Column({ nullable: true, type: 'text' })
  condiciones: string;

  @Column({ nullable: true, type: 'text' })
  pie_pagina: string;

  @Column({ nullable: true, type: 'text' })
  garantia: string;

  @Column({ nullable: true, type: 'text' })
  email_mensaje: string;

  @Column({ nullable: true, type: 'text' })
  email_firma: string;

  @Column({ nullable: false, default: 0, type: 'varchar'})
  total: string;

  @ManyToOne(() => DeliveryType)
  @JoinColumn({ name: 'tipo_entrega_id' })
  tipo_entrega: DeliveryType;

  @ManyToOne(() => QuoteStatusEntity)
  @JoinColumn({ name: 'estado_id' })
  estado: QuoteStatusEntity;

  @ManyToOne(() => QuoteTimeEntity)
  @JoinColumn({ name: 'vigencia_id' })
  vigencia: QuoteTimeEntity;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ name: 'metodo_pago_id' })
  metodo_pago: PaymentMethod;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @ManyToOne(() => Shipping)
  @JoinColumn({ name: 'envio_id' })
  envio: Shipping;

  @OneToMany(() => ProductQuoteEntity, (prod) => prod.cotizacion)
  productos: ProductQuoteEntity[];

  @Column({ nullable: true })
  fecha_confirmacion: Date;

  @Column({ nullable: true })
  fecha_envio: Date;
}
