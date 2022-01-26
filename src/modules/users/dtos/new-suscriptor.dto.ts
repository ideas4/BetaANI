import { IsDefined } from "class-validator";

export class SuscriptorUserDto{  
    @IsDefined({message:'Debe ingresar su correo electrónico'})
    email:string;
}