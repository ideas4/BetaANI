import { IsDefined } from "class-validator";

export class ConfirmAccountDto{
    @IsDefined({message:'Debe ingresar la clave de confirmación'})
    key:string;
}