import { IsNotEmpty } from 'class-validator';

export class CreateSupplierDto {

    @IsNotEmpty({message:'El nombre es requerido'})
    nombre:string;
    
    persona_contacto:string;
    direccion: string;
    numero_contacto:string;
    tipo:string;
    notas:string;
}
