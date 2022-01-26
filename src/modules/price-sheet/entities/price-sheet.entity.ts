import { Column, Entity, Generated, ObjectIdColumn, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({name: 'encabezado_hp'})
export class PriceSheet{

    @PrimaryColumn({name: 'id'})
    id: string;

    @Column({name: 'nombre'})
    nombre: string;

    @Column({name: 'descripcion', nullable: true})
    descripcion: string;
    
    @Column({name: 'tipo', type: 'tinyint'})
    tipo: string;
    
    @Column({name: 'fecha_inicio', type: 'datetime'})
    fecha_inicio: Date;
    
    @Column({name: 'fecha_final', type: 'datetime'})
    fecha_final: Date;
    
    @Column({name: 'fecha_creacion', type: 'datetime'})
    fecha_creacion: Date;
    
    @Column({name: 'fecha_modificacion', type: 'datetime', nullable: true})
    fecha_modificacion: Date;
    
 
}