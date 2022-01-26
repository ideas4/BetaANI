import { PrimaryColumn, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('detalle_factura')
export class DetailBill{

    @PrimaryColumn({name: 'tipo'})
    tipo: number;

    @PrimaryColumn({name: 'serie'})
    serie: string;

    @PrimaryColumn({name: 'numero'})
    numero: string;

    @PrimaryColumn({name: 'linea'})
    linea: number;

    @Column({name: 'bos'})
    bos: string;

    @Column({name: 'codigo_articulo', nullable: true})
    codigo_articulo: string;
    
    @Column({name: 'descripcion_articulo'})
    descripcion_articulo: string
    
    @Column({name: 'cantidad'}) //default 1?
    cantidad: string;
    
    @Column({name: 'precio_unitario'})
    precio_unitario: string;
    
    @Column({name: 'descuento_unitario', default: 0.0})
    descuento_unitario: string;
    
    @Column({name: 'iva_unitario'})
    iva_unitario: string;
    
    @Column({name: 'precio_total'})
    precio_total: string;
    
    @Column({name: 'descuento_total', default: 0.0})
    descuento_total: string;
    
    @Column({name: 'iva_total'})
    iva_total: string;

    @Column({name: 'precio_sinIva'})
    precio_sinIva: string;
}