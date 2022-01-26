import { IsDefined } from 'class-validator';

export class CreateCheckDto {
  @IsDefined({message:'La fecha es requerida'})
  fecha:any;

  @IsDefined({message:'El número de cheque es requerido'})
  no_cheque:number;

  @IsDefined({message:'El concepto es requerido'})
  concepto:string;

  @IsDefined({message:'El monto es requerido'})
  monto:number;


  nota:string;

  @IsDefined({message:'La cuenta bancaria es requerida'})
  cuenta_bancaria:any;

  //contabilidad
  @IsDefined({message:'El tipo dde cuenta es requerida'})
  cuenta_id:any;
}
