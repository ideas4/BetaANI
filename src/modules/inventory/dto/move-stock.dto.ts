import { IsNotEmpty } from "class-validator";

export class MoveStockDto{
    @IsNotEmpty({message:'El producto es requerido'})
    producto_id:number;

    @IsNotEmpty({message:'La sucursal origen es requerida'})
    sorigen:number;

    @IsNotEmpty({message:'La sucursal destino es requerida'})
    sdestino:number;

    @IsNotEmpty({message:'La cantidad es requerida'})
    cantidad:number;

    notas:string;
}