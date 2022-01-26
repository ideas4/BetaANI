import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity({name:'tipo_orden'})
export class OrderType {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;
}