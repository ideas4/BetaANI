import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BankAccount } from "../../bank-accounts/entities/bank-account.entity";
import { DepositType } from "./deposit-type.entity";

@Entity({name:'deposito'})
export class Deposit {
    @PrimaryGeneratedColumn()
    id:number; 

    @Column({nullable:false})
    nombre:string;

    @Column({nullable:false,unique:true})
    no_boleta:string;

    @Column({nullable:false, type: 'varchar'})
    monto:number;

    @Column({nullable:true,type:'text'})
    descripcion:string;

    @Column({nullable:false})
    fecha:Date;

    @ManyToOne(type=>BankAccount)
    @JoinColumn({name:'cuenta_id'})
    cuenta:BankAccount;

    @ManyToOne(type=>User)
    @JoinColumn({name:'usuario_id'})
    usuario:User;

    @ManyToOne(type=>DepositType)
    @JoinColumn({name:'tipo_deposito_id'})
    tipo:DepositType;
}
