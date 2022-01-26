import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'vigencia_cotizacion'})
export class QuoteTimeEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;
}