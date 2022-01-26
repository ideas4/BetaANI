import { IsNotEmpty, IsNumberString } from "class-validator";

export class UpdateCategoryProductDto{
    @IsNotEmpty({message:'El ID de la categoria es requerido'})
    @IsNumberString()
    categoria_id:number;
}