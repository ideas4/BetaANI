import { IsDefined } from "class-validator";

export class CreateAccountDto {
    @IsDefined({message:'El nombre es requerido'})
    nombre:string;

    @IsDefined({message:'El tipo de cuenta es requerido'})
    tipo_cuenta:any;

    descripcion:string;
}
