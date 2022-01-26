import { IsDefined } from "class-validator";

export class CreateDepositTypeDto {

    @IsDefined({message:'El nombre es requerido'})
    nombre:string;
    
}
