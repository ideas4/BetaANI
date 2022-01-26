import { IsDefined, IsNotEmpty } from "class-validator";

export class CreateCouponDto {

    @IsDefined({message:'El nombre es requerido'})
    nombre:string;

    @IsDefined({message:'El valor es requerido'})
    valor:string;

    @IsDefined({message:'El valor es requerido'})
    tipo_cupon:any;

    descripcion:string;
    fecha_expiracion:Date;

}
