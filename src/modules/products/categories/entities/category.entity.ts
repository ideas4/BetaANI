import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../entities/product.entity";

@Entity({name:'categoria'})
export class Category {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({name:'nombre',nullable:false})
    nombre: string;

    @Column({name:'descripcion',nullable:true,type:'text'})
    descripcion: string;

    @ManyToMany(() => Product)
    productos: Product[];
    
}
