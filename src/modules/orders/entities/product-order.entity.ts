import { type } from "os";
import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({name:'orden_producto'})
export class ProductOrder {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    cantidad:number;

    @Column({type: 'varchar'})
    precio:number;

    @Column({type: 'varchar'})
    descuento:number;

    @Column()
    justificacion_descuento:string;

    
    @ManyToOne(type=>Order,prod => prod.productos)
    orden: Order;

    @ManyToOne(type=>Inventory)
    @JoinColumn({name:'inventario_id'})
    inventario:Inventory;

}