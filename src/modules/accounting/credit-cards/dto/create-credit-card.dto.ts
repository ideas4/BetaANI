import { Order } from '../../../orders/entities/order.entity';
import { IsDefined, IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateCreditCardDto {

  @IsDefined({message:'El número de aprobación es requerido'})
  @IsNotEmpty({message:'El número de aprobación es requerido'})
  no_aprobacion:string;

  @IsDefined({message:'El POS es requerido'})
  @IsNotEmpty({message:'El POS es requerido'})
  pos:number;

  @IsDefined({message:'El monto es requerido'})
  @IsNotEmpty({message:'El monto es requerido'})
  monto:number;

  fecha:Date;
  nota:string;
  orden:any;
}
