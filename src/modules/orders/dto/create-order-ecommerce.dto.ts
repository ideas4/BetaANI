import { Type } from "class-transformer";
import { IsDate, IsDefined, IsEmail, IsNotEmpty } from "class-validator";
import { ProductOrderEcommerceDto } from "./product-order-ecommerce.dto";
import { ProductOrderDto } from "./product-order.dto";

export class CreateOrderEcommerceDto {

    fecha_creacion:Date;
    fecha_entrega:Date;

    @IsDefined({message:'El nombre es requerido'})
    @IsNotEmpty({message:'El nombre es requerido'})
    cliente:string;

    @IsDefined({message:'La dirección de entrega es requerida'})
    @IsNotEmpty({message:'La dirección de entrega es requerida'})
    direccion:string;
    
    @IsDefined({message:'El teléfono es requerido'})
    @IsNotEmpty({message:'El teléfono es requerido'})
    telefono:string;
    
    no_guia:string;
    
    nit_cliente:string;
    
    no_factura:string;
    
    total:number;

    envio:any;
    
    productos:ProductOrderEcommerceDto[];    
}
