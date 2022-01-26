import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

 @Entity({name:'color'})
export class Color {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'nombre',nullable:false})
    nombre:string;
}
