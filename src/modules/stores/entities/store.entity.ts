import { AccountingMovement } from "src/modules/accounting/accounting-movements/entities/accounting-movement.entity";
import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'sucursal'})
export class Store {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'nombre',nullable:false})
    nombre:string;

    @Column({name:'direccion',nullable:true})
    direccion:string;

    @Column({name:'notas',nullable:true})
    notas:string;

    @Column({nullable:false,default:0})
    caja_chica:number;

    @ManyToOne(() => User)
    @JoinColumn({name:'encargado_id'})
    encargado: User;

    @OneToMany(type => User,store=>store.sucursal)
    usuarios: User[];

    @OneToMany(type => AccountingMovement,store=>store.sucursal)
    movimientos_caja: AccountingMovement[];
}
