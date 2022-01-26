import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'tipo_cupon'})
export class CouponType {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    nombre:string;
}