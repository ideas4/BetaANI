import { IsDefined } from "class-validator";

export class CreateAccountTypeDto {
    @IsDefined({message:'El nombre es requerido'})
    nombre:string;
}
