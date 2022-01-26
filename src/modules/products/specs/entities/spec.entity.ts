import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'especificacion'})
export class Spec {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'nombre',nullable:false})
    nombre:string;

    @Column({nullable:true,type:'text'})
    descripcion:string;
}
