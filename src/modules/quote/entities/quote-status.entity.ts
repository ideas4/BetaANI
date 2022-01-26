import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'estado_cotizacion'})
export class QuoteStatusEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;
}