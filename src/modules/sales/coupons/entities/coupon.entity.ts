import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CouponType } from "./coupon-value-type.entity";

@Entity({name:'coupon'})
export class Coupon {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    nombre:string;

    @Column({nullable:true,type:'text'})
    descripcion:string;

    @Column({nullable:false})
    valor:string;

    @Column({nullable:false})
    fecha_creacion:Date;

    @Column({nullable:true})
    fecha_expiracion:Date;

    @ManyToOne(type=>CouponType)
    @JoinColumn({name:'tipo_cupon_id'})
    tipo_cupon:CouponType;

}
