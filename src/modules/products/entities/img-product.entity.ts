import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({name:'imagen_producto'})
export class ImageProduct {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    url: string;

    @Column()
    prioridad: number;
    
    @ManyToOne(() => Product, prod => prod.imagenes)
    @JoinColumn({name:'producto_id'})
    producto: Product;

}