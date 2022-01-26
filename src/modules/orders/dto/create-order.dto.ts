import { Type } from "class-transformer";
import { IsDate, IsDateString, isDateString, IsDefined, IsEmail, IsEmpty, IsNotEmpty } from "class-validator";
import { ProductOrderDto } from "./product-order.dto";

export class CreateOrderDto {
    @IsDefined({message:'La fecha de creación es requerida'})
    @IsDate({message:'El formato de fecha de creación es incorrecto'})
    @Type(() => Date)
    fecha_creacion:Date;

    @IsDefined({message:'La fecha de entrega es requerida'})
    @IsDate({message:'El formato de fecha de entrega es incorrecto'})
    @Type(() => Date)
    fecha_entrega:Date;

    @IsDefined({message:'El nombre del cliente es requerido'})
    @IsNotEmpty({message:'El nombre del cliente es requerido'})
    cliente:string;

    @IsDefined({message:'La dirección de entrega es requerida'})
    @IsNotEmpty({message:'La dirección de entrega es requerida'})
    direccion:string;
    
    @IsDefined({message:'El teléfono del cliente es requerido'})
    @IsNotEmpty({message:'El teléfono del cliente es requerido'})
    telefono:string;
    
    @IsEmail({},{message:'El correo tiene un formato inválido'})
    email:string;
    
    no_guia:string;
    
    nit_cliente:string;
    
    no_factura:string;
    
    total:number;

    envio:any;

    productos:ProductOrderDto[];

    @IsDefined({message:'El método de pago es requerido'})
    metodo_pago:any;

    @IsDefined({message:'El estado del pedido es requerido'})
    estado:any;
    
    orden:any;
    @IsDefined({message:'Tipo de entrega es requerido'})
    entrega:any;

    id_tarjeta:any;
}
