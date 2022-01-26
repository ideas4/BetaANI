import { IsNotEmpty } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({message:'El nombre es requerido'})
  nombre:string;

  @IsNotEmpty({message:'El costo es requerido'})
  costo:number;

}
