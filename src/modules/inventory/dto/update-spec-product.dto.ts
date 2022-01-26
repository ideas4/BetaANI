import { IsDefined, IsNotEmpty, IsNumberString } from "class-validator";

export class UpdateSPecProductDto{
    @IsNotEmpty({message:'El ID de la especificación es requerido'})
    @IsDefined({message:'El ID de la especificación es requerido'})
    @IsNumberString()
    spec_id:number;

    @IsDefined({message:'El valor es requerido'})
    valor:string;
}