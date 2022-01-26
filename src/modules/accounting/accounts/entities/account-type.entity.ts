import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'tipo_cuenta'})
export class AccountType {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;
}
