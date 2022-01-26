import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BankAccount } from '../../bank-accounts/entities/bank-account.entity';
import { User } from '../../../users/entities/user.entity';
import { MoneyWithdrawType } from './withdraw-type.entity';

@Entity('retiro')
export class MoneyWithdraw {
  @PrimaryGeneratedColumn()
  id:number;

  @Column({nullable:false})
  nombre:string;

  @Column({nullable:false,unique:true})
  no_boleta:string;

  @Column({nullable:false})
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

  @ManyToOne(type=>MoneyWithdrawType)
  @JoinColumn({name:'tipo_retiro_id'})
  tipo:MoneyWithdrawType;
}
