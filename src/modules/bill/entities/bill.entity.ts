import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('encabezado_factura')
export class Bill{
    @PrimaryColumn({name: 'tipo'})
    tipo: number;

    @PrimaryColumn({name: 'serie'})
    serie: string;

    @PrimaryColumn({name: 'numero'})
    numero: string;

    @Column({name: 'dte'})
    dte: string;

    @Column({name: 'fecha'})
    fecha: string;

    @Column({name: 'fecha_certificacion'})
    fecha_certificacion: string;

    @Column({name: 'nit_cliente'})
    nit_cliente: string;

    @Column({name: 'razonsocial_cliente'})
    razonsocial_cliente: string;

    @Column({name: 'correoElectronico', nullable: true} )
    correoElectronico: string;

    @Column({name: 'direccion'})
    direccion: string;

    @Column({name: 'codigoPostal', nullable: true})
    codigoPostal: string;

    @Column({name: 'municipio', nullable: true})
    municipio: string;

    @Column({name: 'departamento', nullable: true})
    departamento: string;

    @Column({name: 'pais'})
    pais: string;

    @Column({name: 'montoTotal'})
    montoTotal:  string;

    @Column({name: 'iva_total'})
    iva_total: string;

    @Column({name: 'descuento_total', default: 0.0})
    descuento_total: string;

    @Column({name: 'respuesta', nullable: true, type: "longtext"})
    respuesta: string;

    @Column({name: 'orden_compra', nullable: true})
    orden_compra: string;

    @Column({name: 'envio', nullable: true})
    envio: string;

    @Column({name: 'condicionPago', nullable: true})
    condicionPago: string;

    @Column({name: 'fecha_pago', nullable: true})
    fecha_pago: string;

    @Column({name: 'estado', default: 1})
    estado: number;

    @Column({name: 'fecha_anulacion', nullable: true})
    fecha_anulacion: string;


    @Column({name: 'comentario', nullable: true, type: "longtext"})
    comentario: string;


    @Column({name: 'credito'})
    credito: string;

    
    
}