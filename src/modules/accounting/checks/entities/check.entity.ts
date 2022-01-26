import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccount } from '../../bank-accounts/entities/bank-account.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('cheque')
export class Check {

  @PrimaryGeneratedColumn()
  id:number;

  @Column({type:'datetime'})
  fecha:Date;

  @Column()
  no_cheque:number;

  @Column()
  concepto:string;

  @Column({type:'double'})
  monto:number;

  @Column({type:'text'})
  nota:string;

  @ManyToOne(()=>BankAccount)
  @JoinColumn({name:'no_cuenta_bancaria'})
  cuenta_bancaria:BankAccount;

  @ManyToOne(()=>Account)
  @JoinColumn({name:'cuenta_id'})
  cuenta:Account;
}
