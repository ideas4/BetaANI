import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'detalle_hp'})
export class DetailPriceSheet{

    @PrimaryColumn({name: 'hojaId'})
    hojaId: number;

    @PrimaryColumn({name: 'articuloId'})
    articuloId: number;

    @Column({name: 'sku'})
    sku: string;

    @Column({name: 'nombre'})
    nombre: string;

    @Column({name: 'precio'})
    precio: string;

    @Column({name: 'tipo_promocion'})
    tipo_promocion: string;

    @Column({name: 'estado'})
    estado: string;
}