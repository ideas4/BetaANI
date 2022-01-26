import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Deposit } from '../../deposits/entities/deposit.entity';
import { Check } from '../../checks/entities/check.entity';
import { User } from '../../../users/entities/user.entity';
import { SaleEntity } from '../../../sales/entities/sale.entity';
import { MoneyWithdraw } from '../../money-withdraw/entities/money-withdraw.entity';

@Entity('detalle_libro_diario')
export class LogBook {

  @PrimaryGeneratedColumn()
  id:number;

  @Column({type:'datetime'})
  fecha:Date;

  @Column()
  concepto:string;

  @Column({type:'double'})
  total:number;

  @Column({type:'int'})
  deber:number;

  @Column({type:'int'})
  haber:number;

  @ManyToOne(()=>Account)
  @JoinColumn({name:'cuenta_id'})
  cuenta:Account;

  @ManyToOne(()=>User)
  @JoinColumn({name:'usuario_id'})
  usuario:User;

  @ManyToOne(()=>Deposit)
  @JoinColumn({name:'deposito_id'})
  deposito:Deposit;

  @ManyToOne(()=>Check)
  @JoinColumn({name:'cheque_id'})
  cheque:Check;

  @ManyToOne(()=>SaleEntity)
  @JoinColumn({name:'venta_id'})
  venta:SaleEntity;

  @ManyToOne(()=>MoneyWithdraw)
  @JoinColumn({name:'retiro_id'})
  retiro:MoneyWithdraw;
}
