
//import { IsEmail, IsNotEmpty } from 'class-validator';

import { IsDefined } from "class-validator";

export class RegisterUserDto{
    
    @IsDefined({message:'Debe ingresar su correo electrónico'})
    email:string;
    
    @IsDefined({message:'Debe ingresar su nombre'})
    nombre:string;
    
    @IsDefined({message:'Debe ingresar su apellido'})
    apellido:string;
    
    @IsDefined({message:'Debe ingresar un número de teléfono'})
    telefono:string;

    @IsDefined({message:'Debe ingresar una dirección'})
    direccion:string;

    @IsDefined({message:'Debe ingresar su género'})
    genero:boolean;

    @IsDefined({message:'Debe ingresar su fecha de nacicmiento'})
    fecha_nacimiento:string;

    @IsDefined({message:'Debe ingresar una contraseña'})
    contrasenia:string;

}