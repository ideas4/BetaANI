import { IsDefined } from "class-validator";

export class CreateAccountingMovementTypeDto {
    @IsDefined({message:'El nombre es requerido'})
    nombre:string;
}
