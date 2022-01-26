import { IsDefined, IsNotEmpty,IsNumber,IsNumberString } from 'class-validator';


export class CreateProductDto {

    @IsNotEmpty({message:'El nombre es requerido'})
    nombre:string;

    @IsNotEmpty({message:'El SKU es requerido'})
    sku:string;
    
    @IsNotEmpty({message:'El precio original es requerido'})
    @IsNumberString()
    precio_original:number;
    
    @IsNotEmpty({message:'El precio de venta es requerido'})
    @IsNumberString()
    precio_venta:number;
    
    @IsNotEmpty({message:'La marca es requerida'})
    @IsNumberString()
    marca:any;

    @IsNotEmpty({message:'El proveedor es requerido'})
    @IsNumberString()
    proveedor:any;

    @IsNotEmpty({message:'La sucursal es requerida'})
    @IsNumberString()
    sucursal:number;

    @IsDefined({message:'El color es requerido'})
    color:any;

    @IsNotEmpty({message:'La cantidad es requerida'})
    @IsNumberString()
    cantidad:number;


    descripcion:string;
    categoria:any;

}
