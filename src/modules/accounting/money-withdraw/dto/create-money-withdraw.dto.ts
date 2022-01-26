import { IsDefined, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMoneyWithdrawDto {
  @IsDefined({message:'El No. de boleta es requerido'})
  no_boleta:string;

  @IsDefined({message:'El titulo es requerido'})
  nombre:string;

  @IsDefined({message:'El monto es requerido'})
  @IsNumber({allowInfinity:false,allowNaN:false,},
    {message:'El formato del monto es incorrecto'})
  @Type(() => Number)
  monto:number;

  descripcion:string;

  @IsDefined({message:'La cuenta bancaria es requerida'})
  cuenta:any;

  @IsDefined({message:'El tipo de retiro es requerido'})
  tipo:any;

  //contabilidad
  @IsDefined({message:'El tipo dde cuenta es requerida'})
  cuenta_id:any;
  concepto:string;
}
