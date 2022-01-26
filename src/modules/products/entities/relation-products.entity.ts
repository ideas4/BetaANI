import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('producto_relacionado')
export class RelationProducts{

  @PrimaryGeneratedColumn()
  id:number;

  @ManyToOne(type => Product,)
  @JoinColumn({name:'id_principal'})
  id_principal:Product;

  @ManyToOne(type => Product)
  @JoinColumn({name:'id_relacionado'})
  id_relacionado:Product;

}