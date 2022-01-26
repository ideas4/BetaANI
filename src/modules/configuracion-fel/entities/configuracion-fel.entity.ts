import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('configuracion_fel')
export class ConfiguracionFel{
    @PrimaryColumn({name: 'id'})
    id: number;

    @Column({name: 'url_api_cert'})
    url_api_cert: string;
    
    @Column({name: 'usuario'})
    usuario: string;

    @Column({name: 'clave'})
    clave: string;

    @Column({name: 'cliente'})
    cliente: string;

    @Column({name: 'contrato'})
    contrato: string;

    @Column({name: 'ip_origen'})
    ip_origen: string;

    @Column({name: 'nit_emisor'})
    nit_emisor: string;

    @Column({name: 'nombre_emisor'})
    nombre_emisor: string;

    @Column({name: 'nombre_comercial_emisor'})
    nombre_comercial_emisor: string;

    @Column({name: 'direccion_emisor'})
    direccion_emisor: string;

    @Column({name: 'cp_emisor'})
    cp_emisor: string;

    @Column({name: 'municipio_emisor'})
    municipio_emisor: string;

    @Column({name: 'depto_emisor'})
    depto_emisor: string;

    @Column({name: 'pais_emisor'})
    pais_emisor: string;
}