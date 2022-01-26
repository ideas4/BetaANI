import { IsDefined } from "class-validator";

export class CreateAccountingMovementDto {
    
    @IsDefined({message:'El nombre es requerido'})
    nombre:string;
    
    @IsDefined({message:'La descripción es requerida'})
    descripcion:string;
    
    @IsDefined({message:'El monto es requerido'})
    monto:number;
    
    @IsDefined({message:'El tipo de movimiento es requerido'})
    tipo_movimiento:any;
    
    @IsDefined({message:'La partida es requerida'})
    partida:any;

    @IsDefined({message:'El usuario es requerido'})
    usuario:any;

    fecha:Date;
}
