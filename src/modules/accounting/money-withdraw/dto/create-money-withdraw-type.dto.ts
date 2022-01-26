import { IsDefined } from 'class-validator';

export class CreateMoneyWithdrawTypeDto{
  @IsDefined({message:'El nombre es requerido'})
  nombre:string;

}