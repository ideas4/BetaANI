import { Type } from "class-transformer";
import { IsDefined, IsNumber } from "class-validator";

export class ProductOrderDto {
   
   @IsDefined({message:'La cantidad es requerida'})
   @IsNumber({allowNaN:false,allowInfinity:false},{message:'La cantidad de producto debe ser un número'})
   @Type(() => Number)
   cantidad:number;

   @IsDefined({message:'El id de inventario es requerido'})
   id_inventario:any;

   @IsNumber({allowNaN:false,allowInfinity:false},{message:'La cantidad de producto debe ser un número'})
   @Type(() => Number)
   descuento:number;

   justificacion_descuento:string;

   @IsDefined({message:'El precio de venta es requerido'})
   @IsNumber({allowNaN:false,allowInfinity:false},{message:'La cantidad de producto debe ser un número'})
   @Type(() => Number)
   precio:number;
}
