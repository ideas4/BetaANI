import { IsNotEmpty,IsEmail } from 'class-validator';

export class CreateCustomerDto {

    @IsNotEmpty({message:'El nombre es requerido'})
    nombre_completo:string;

    direccion:string;

    telefono:string;

    //@IsEmail({},{message:'El email no cumple con el formato'})
    email:string;

    nit:string;

    notas:string;
}
