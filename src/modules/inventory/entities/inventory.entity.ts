import { Store } from "src/modules/stores/entities/store.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LogInventory } from "./log-inventory.entity";
import { Product } from "../../products/entities/product.entity";

@Entity({name:'inventario'})
export class Inventory {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false,default:0})
    cantidad:number;

    @Column({nullable:false,default:0})
    cantidad_daniada:number;

    @Column({nullable:false,default:0})
    cantidad_reservada:number;

    @ManyToOne(type=>Store)
    @JoinColumn({name:'sucursal_id'})
    sucursal:Store;
    
    @ManyToOne(product=>Product)
    @JoinColumn({name:'producto_id'})
    producto:Product;
    
}
