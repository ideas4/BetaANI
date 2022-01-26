import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'cliente_hojaprecio'})
export class ClientPriceSheet{
    @PrimaryColumn({name: 'hojaId'})
    hojaId : number;

    @PrimaryColumn({name: 'clienteId'})
    clienteId: number;

    @Column({name: 'hojaPrecioTipo'})
    hojaPrecioTipo : string;
    
    @Column({name: 'fecha_asignacion'})
    fecha_asignacion: Date;
    
    @Column({name: 'estado'})
    estado: string;
}