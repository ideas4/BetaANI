import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BankAccount } from "./bank-account.entity";

@Entity({name:'tipo_cuenta_bancaria'})
export class BankAccountType{
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;

}