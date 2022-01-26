import { IsNotEmpty } from "class-validator";

export class CreateDetailBillDto{
    
    @IsNotEmpty()
    tipo: number;
    
    @IsNotEmpty()
    serie: string;
    
    @IsNotEmpty()
    numero: string;
    
    @IsNotEmpty()
    linea: number;
    
    @IsNotEmpty()
    bos: string;
    
    @IsNotEmpty()
    codigo_articulo: string;
    
    @IsNotEmpty()
    descripcion_articulo: string
    
    @IsNotEmpty()
    cantidad: string;
    
    @IsNotEmpty()
    precio_unitario: string; 

    descuento_unitario: string;
    
    @IsNotEmpty()
    iva_unitario: string;
    
    @IsNotEmpty()
    precio_total: string;
 
    descuento_total: string;
    
    @IsNotEmpty()
    iva_total: string;

    precio_sinIva: string;

}