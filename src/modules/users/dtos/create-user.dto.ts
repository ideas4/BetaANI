
//import { IsEmail, IsNotEmpty } from 'class-validator';

import { IsDefined } from "class-validator";

export class CreateUserDto{

    @IsDefined({message:'El nombre de usuario es requerido'})
    nombre_usuario:string;
    
    @IsDefined({message:'El correo electrónico del usuario es requerido'})
    email:string;
    
    @IsDefined({message:'El nombre  es requerido'})
    nombre:string;
    
    @IsDefined({message:'El apellido del usuario es requerido'})
    apellido:string;
    
    @IsDefined({message:'El puesto es requerido'})
    rol:any;
    
    @IsDefined({message:'Se debe asignar el usuario a una sucursal'})
    sucursal:any;

    contrasenia:string;

    genero:any;
}