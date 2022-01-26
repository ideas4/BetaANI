import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('control-dte')
export class ControlDte{
    @PrimaryColumn({name: 'id'})
    id: number;

    @PrimaryColumn({name: 'lote'})
    lote: number;

    @Column({name: 'fecha_adicion'})
    fecha_adicion: string;

    @Column({name: 'cantidad'})
    cantidad: number;

    @Column({name: 'disponible'})
    disponible: number;
}