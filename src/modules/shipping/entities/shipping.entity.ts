import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('envios')
export class Shipping {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:false,default:''})
  nombre: string;

  @Column({nullable:false,default:0})
  costo: number;
}
