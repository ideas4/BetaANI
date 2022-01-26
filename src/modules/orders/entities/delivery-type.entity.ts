import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({name:'tipo_entrega'})
export class DeliveryType {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;

}