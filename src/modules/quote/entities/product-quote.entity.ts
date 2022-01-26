import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuoteEntity } from './quote.entity';
import { Product } from '../../products/entities/product.entity';
import { QuoteClientEntity } from './quote-client.entity';

@Entity({ name: 'cotizacion_producto' })
export class ProductQuoteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cantidad: number;

  @Column()
  precio: string;

  @Column()
  descuento: string;

  @Column()
  justificacion_descuento: string;

  @Column()
  imagen: string;

  @ManyToOne((type) => QuoteEntity, (prod) => prod.productos)
  cotizacion: QuoteEntity;

  @ManyToOne((type) => QuoteClientEntity, (prod) => prod.productos)
  @JoinColumn({ name: 'cotizacionClienteId' })
  cotizacion_cliente: QuoteClientEntity;

  @ManyToOne((type) => Product)
  @JoinColumn({ name: 'producto_id' })
  producto: Product;
}
