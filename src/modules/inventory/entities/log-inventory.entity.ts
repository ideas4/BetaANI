import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inventory } from "./inventory.entity";

@Entity({name:'log_inventario'})
export class LogInventory {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    notas:string;

    @Column({nullable:true,type:'text'})
    descripcion:string;

    @Column()
    fecha:Date;

    @Column()
    cantidad_anterior:number;

    @Column()
    cantidad_actual:number;

    @Column({default:null,nullable:true})
    pdf_name:string;

    @ManyToOne(() => User)
    @JoinColumn({name:'usuario_id'})
    usuario: User;

    @ManyToOne(() => Inventory)
    @JoinColumn({name:'inventario_id'})
    inventario: Inventory;
    
}