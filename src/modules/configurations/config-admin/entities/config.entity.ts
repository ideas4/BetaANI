import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'configuracion'})
export class Config {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false,default:''})
    url_pagina:string;

    @Column({nullable:false,default:''})
    url_imagenes:string;

    //configuraciones de contabilidad
    @Column({nullable:false,default:0})
    cajaChica:string;
    
    //config de correos
    @Column({nullable:false,default:''})
    email_notificaciones:string;

    @Column({nullable:false,default:''})
    email_host:string;

    @Column({nullable:false,default:465})
    email_puerto:number;

    @Column({nullable:false,default:''})
    email_send_user:string;

    @Column({nullable:false,default:''})
    email_send_password:string;

    @Column({nullable:true,type:'text'})
    plantilla_cotizacion_encabezado_pagina:string;

    @Column({nullable:true,type:'text'})
    plantilla_cotizacion_terminos_pago:string;

    @Column({nullable:true,type:'text'})
    plantilla_cotizacion_condiciones:string;

    @Column({nullable:true,type:'text'})
    plantilla_cotizacion_pie_pagina:string;

    @Column({nullable:true,type:'text'})
    plantilla_cotizacion_garantia:string;

    @Column({nullable:true,type:'text'})
    plantilla_cotizacion_email_mensaje:string;

    @Column({nullable:true,type:'text'})
    plantilla_cotizacion_email_firma:string;
}
