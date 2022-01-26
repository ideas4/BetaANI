import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Bank } from "../../banks/entities/bank.entity";
import { BankAccountType } from "./bank-account-type.entity";

@Entity({name:'cuenta_bancaria'})
export class BankAccount {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    no_cuenta:string;

    @Column()
    nombre:string;

    @Column()
    notas:string;

    @Column({type:'double'})
    saldo:number;

    @Column()
    cuentahabiente:string;

    @ManyToOne(() => BankAccountType)
    @JoinColumn({name:'tipo_cuenta_id'})
    tipo_cuenta: BankAccountType;

    @ManyToOne(type => Bank, bank => bank.cuentas) 
    @JoinColumn({name:'banco_id'})
    banco: Bank; 

}
