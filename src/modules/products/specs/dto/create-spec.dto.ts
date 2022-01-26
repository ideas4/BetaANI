import { IsDefined } from "class-validator";

export class CreateSpecDto {
    @IsDefined({message:'El nombre de la especificación es requerido'})
    nombre:string;

    @IsDefined({message:'La descripción es requerida'})
    descripcion:string;
}
