import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../entities/product.entity";

@Entity({name:'marca'})
export class Brand {
    
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({name:'nombre',nullable:false})
    nombre: string;

    @OneToMany(() => Product,product => product.marca)
    products:Product[];
}
