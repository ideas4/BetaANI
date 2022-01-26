import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BankAccount } from "../../bank-accounts/entities/bank-account.entity";

@Entity({name:'banco'})
export class Bank {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    nombre:string;

    @OneToMany(type => BankAccount, bank => bank.banco) 
    cuentas: BankAccount[];  

}
