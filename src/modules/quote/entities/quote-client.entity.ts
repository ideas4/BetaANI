import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductQuoteEntity } from './product-quote.entity';
@Entity({ name: 'cotizacion_cliente' })
export class QuoteClientEntity {
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

  @OneToMany(() => ProductQuoteEntity, (prod) => prod.cotizacion_cliente)
  productos: ProductQuoteEntity[];

  @Column({ nullable: true })
  fecha_confirmacion: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;
}
