import { IsNotEmpty } from "class-validator";

export class CreateControlDteDto{
    
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    lote: number;

    fecha_adicion: string;
    
    cantidad: number;

    disponible: number;
}