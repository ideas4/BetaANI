import { IsDefined } from "class-validator";

export class CreateConfigEcommerceDto {

    titulo_inicio:string;

    subtitulo_inicio:string;

    descripcion_inicio:string;

    titulo_footer:string;
    
    descripcion_footer:string;

    sucursal:any;
}
