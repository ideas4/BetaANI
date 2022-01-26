import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'proveedor'})
export class Supplier {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'nombre'})
    nombre:string;

    @Column({name:'persona_contacto'})
    persona_contacto:string;

    @Column({name:'direccion'})
    direccion: string;

    @Column({name:'numero_contacto'})
    numero_contacto:string;

    @Column({name:'tipo'})
    tipo:string;

    @Column({name:'notas'})
    notas:string;
}
