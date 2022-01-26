import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'estado_usuario'})
export class StatuslUser {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({nullable:false})
    nombre: string;

    @Column({nullable:true,type:'text'})
    descripcion: string;
}