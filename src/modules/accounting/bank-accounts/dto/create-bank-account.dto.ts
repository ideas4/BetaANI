import { IsDefined } from "class-validator";

export class CreateBankAccountDto {

    @IsDefined({message:'El número de cuenta es requerido'})
    no_cuenta:string;

    @IsDefined({message:'El nombre es requerido'})
    nombre:string;


    notas:string;

    @IsDefined({message:'El cuentahabiente es requerido'})
    cuentahabiente:string;

    @IsDefined({message:'El banco es requerido'})
    banco: any;
    
    @IsDefined({message:'El tipo de cuenta es requerido'})
    tipo_cuenta:any;
}
