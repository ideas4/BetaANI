import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../entities/product.entity";
import { Spec } from "./spec.entity";

@Entity({name:'especificacion_producto'})
export class SpecProduct {

    @ManyToOne(() => Product,prod=>prod.especificaciones,{primary:true})
    @JoinColumn({name:'producto_id'})
    producto:Product;

    @ManyToOne(() => Spec,{primary:true})
    @JoinColumn({name:'especificacion_id'})
    especificacion:Spec;

    @Column({nullable:false})
    valor:string;
}
