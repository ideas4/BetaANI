//validaciones
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateBillDto{

    @IsNotEmpty()
    tipo: number;

    @IsNotEmpty()
    serie: string;

    @IsNotEmpty()
    numero: string;
    
    dte: string;
    
    fecha: string;
    
    fecha_certificacion: string;
    
    nit_cliente: string;
    
    razonsocial_cliente: string;

    correoElectronico: string;
    
    direccion: string;
    
    codigoPostal: string;
    
    municipio: string;
    
    departamento: string;
    
    pais: string;
    
    montoTotal:  string;
    
    iva_total: string;
    
    descuento_total: string;
    
    respuesta: string;
    
    orden_compra: string;
    
    envio: string;
    
    condicionPago: string;
    
    fecha_pago: string;

    estado: number;

    fecha_anulacion:string;

    nota:string;
    
    credito: string;
    

}