import { IsNotEmpty } from 'class-validator';

export class CreateStoreDto {
    
    @IsNotEmpty({message:'El nombre es requerido'})
    nombre:string;

    direccion:string;
    
    notas:string;

    @IsNotEmpty({message:'El encargado es requerido'})
    encargado:any;
}
