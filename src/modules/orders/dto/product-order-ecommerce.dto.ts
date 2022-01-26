import { Type } from "class-transformer";
import { IsDefined, IsNumber } from "class-validator";

export class ProductOrderEcommerceDto {
   
   @IsDefined({message:'La cantidad es requerida'})
   @IsNumber({allowNaN:false,allowInfinity:false},{message:'La cantidad de producto debe ser un número'})
   @Type(() => Number)
   cantidad:number;

   @IsDefined({message:'El id del producto es requerido'})
   id:any;

   precio:number;
}
