import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({name:'estado_orden'})
export class OrderStatus {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;
}