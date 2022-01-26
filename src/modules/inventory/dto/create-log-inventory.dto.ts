export class CreateLogInventoryDto{
    notas:string;
    descripcion:string;
    fecha:Date;
    cantidad_anterior:number;
    cantidad_actual:number;
    usuario:any;
    inventario: any;
    pdf_name?:string;
}