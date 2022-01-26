import { IsDefined } from "class-validator";

export class CreateBankDto {
    
    @IsDefined({message:'El nombre del banco es requerido'})
    nombre:string;
}
