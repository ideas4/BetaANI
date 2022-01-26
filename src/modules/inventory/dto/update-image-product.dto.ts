import { IsNotEmpty, IsNumberString } from "class-validator";

export class UpdateImageProductDto{
    @IsNotEmpty({message:'El ID de la imagen es requerido'})
    @IsNumberString()
    imagen_id:number;
}