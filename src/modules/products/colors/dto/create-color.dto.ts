import { IsDefined } from "class-validator";

export class CreateColorDto {

    @IsDefined({message:'El nombre del color es requerido'})
    nombre:string;
}
