import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'tipo_retiro'})
export class MoneyWithdrawType {
    @PrimaryGeneratedColumn()
    id:number; 

    @Column({nullable:false})
    nombre:string;
}