import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('configuracion_ecommerce')
export class ConfigEcommerce {
    @PrimaryGeneratedColumn()
    id:number;

    //INFORMACION 
    @Column({nullable:false,default:''})
    nombre:string;

    @Column({nullable:false,default:''})
    direccion:string;

    @Column({nullable:false,default:''})
    telefono:string;

    @Column({nullable:false,default:''})
    correo_electronico:string;

    @Column({nullable:true,type:'text'})
    terminos_condiciones:string;

    @Column({nullable:false,default:''})
    logo:string;

    //PAGINA DE INICIO
    @Column({nullable:false,default:''})
    titulo_inicio:string;

    @Column({nullable:false,default:''})
    favicon:string;

    @Column({nullable:false,default:''})
    imagen_inicio:string;

    @Column({nullable:false,default:''})
    subtitulo_inicio:string;

    @Column({nullable:false,default:''})
    texto_boton_inicio:string;

    @Column({nullable:true,type:'text'})
    descripcion_inicio:string;

    //BANER DE PROMOCION

    @Column({nullable:false,default:''})
    imagen_banner:string;

    @Column({nullable:false,default:''})
    titulo_banner:string;

    @Column({nullable:false,default:''})
    subtitulo_banner:string;

    @Column({nullable:true,type:'text'})
    descripcion_banner:string;

    @Column({nullable:false,default:''})
    texto_boton_banner:string;

    //FOOTER
    @Column({nullable:false,default:''})
    titulo_footer:string;
    
    @Column({nullable:true,type:'text'})
    descripcion_footer:string;

    //COLORES
    @Column({name:'primary_color',nullable:false,default:''})
    primaryColor:string;

    @Column({name:'primary_light_color',nullable:false,default:''})
    primaryLightColor:string;

    @Column({name:'primary_dark_color',nullable:false,default:''})
    primaryDarkColor: string;

    @Column({name:'primary_text_color',nullable:false,default:''})
    PrimaryTextColor:string;

    @Column({name:'secondary_color',nullable:false,default:''})
    secondaryColor:string;

    @Column({name:'secondary_dark_color',nullable:false,default:''})
    secondaryDarkColor:string;

    @Column({name:'secondary_text_color',nullable:false,default:''})
    secondaryTextColor:string; 

    //BANNER-PROMOCION DEL MES
    @Column({name:'promocion_mes',nullable:false,default:''})
    promocionMes:string; 

    //Correo electronico
    @Column({nullable:true,type:'text'})
    mensaje_bienvenida:string; 

    @Column({nullable:true,type:'text'})
    mensaje_orden:string;

    @Column({nullable:false,default:''})
    banner_orden:string;

    @Column({nullable:false,default:''})
    banner_bienvenida:string;
}
