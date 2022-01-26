import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'tipo_deposito'})
export class DepositType {
    @PrimaryGeneratedColumn()
    id:number; 

    @Column({nullable:false})
    nombre:string;
}