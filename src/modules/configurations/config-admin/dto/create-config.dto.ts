import { IsDefined, IsString } from "class-validator";

export class CreateConfigDto {
    @IsDefined({message:'El nombre de la tienda es requerido'})
    nombre:string;

    //@IsDefined({message:'El logo de la tienda es requerido'})
    logo:string;

    @IsDefined({message:'Debe ingresar una dirección'})
    direccion:string;

    @IsDefined({message:'Debe ingresar un coreo eléctronico de tienda'})
    email:string;

    //configuraciones de contabilidad
    @IsDefined({message:'Debe ingresar un monto asignado a caja chica'})
    cajaChica:string;
    
    // configuraciones de orden
    @IsString({message:'El disclaimer de orden debe ser un texto'})
    disclaimerOrden:string;

    //clave de administador
    @IsDefined({message:'La clave de administador debe ser ingresada'})
    claveAdministrador:string;
}
