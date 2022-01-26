import { IsNotEmpty } from "class-validator";

export class CreateConfiguracionFelDto{
    @IsNotEmpty()
    id: number;

    url_api_cert: string;
    
    usuario: string;

    
    clave: string;

  
    cliente: string;

   
    contrato: string;

  
    ip_origen: string;

    
    nit_emisor: string;

    
    nombre_emisor: string;

   
    nombre_comercial_emisor: string;


    direccion_emisor: string;

  
    cp_emisor: string;

  
    municipio_emisor: string;

  
    depto_emisor: string;


    pais_emisor: string;
}