import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AccountType } from './account-type.entity';

@Entity({name:'cuenta'})
export class Account {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;

    @Column()
    codigo_mayor:number ;

    @Column()
    descripcion:string;

    @Column({default:0})
    err:number;

    @ManyToOne(type=>AccountType)
    @JoinColumn({name:'tipo_cuenta_id'})
    tipo_cuenta:AccountType;
}
