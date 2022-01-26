import { Store } from "src/modules/stores/entities/store.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AccountingMovementType } from "./accounting-movement-type.entity";
import { Account } from '../../accounts/entities/account.entity';

@Entity({name:'movimiento_caja'})
export class AccountingMovement {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    nombre:string;

    @Column({nullable:false})
    fecha:Date;

    @Column({nullable:false,type:'text'})
    descripcion:string;

    @Column({nullable:false, type: 'varchar'})
    monto:number;

    @ManyToOne(type=>AccountingMovementType)
    @JoinColumn({name:'tipo_movimiento_id'})
    tipo_movimiento:AccountingMovementType;


    @ManyToOne(type=>Account)
    @JoinColumn({name:'partida_id'})
    partida:Account;

    @ManyToOne(type=>User)
    @JoinColumn({name:'usuario_id'})
    usuario:User;
 
    @ManyToOne(type=>Store,store=>store.movimientos_caja,{nullable:false})
    @JoinColumn({name:'sucursal_id'})
    sucursal:Store;

}
