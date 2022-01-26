import { IsNotEmpty } from "class-validator";

export class CreatePriceSheetDto{
    
    @IsNotEmpty({message:'El id es requerido.'})
    id: string;
   
    nombre: string;
   
    descripcion: string;
   
    tipo: string;
   
    fecha_inicio: Date;
    
    fecha_final: Date;
 
    fecha_modificacion: Date;

    fecha_creacion: Date;

}