import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'rol'})
export class RolUser {

    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({nullable:false})
    nombre: string;

    @Column({nullable:true,type:'text'})
    descripcion: string;
}