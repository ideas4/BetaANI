import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'tipo_movimiento'})
export class AccountingMovementType {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;
}
