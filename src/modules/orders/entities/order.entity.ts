import { TipoOrden } from "src/constants";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DeliveryType } from "./delivery-type.entity";
import { OrderStatus } from "./order-status.entity";
import { PaymentMethod } from "./payment-method.entity";
import { ProductOrder } from "./product-order.entity";
import { Shipping } from '../../shipping/entities/shipping.entity';
@Entity({name:'orden'})
export class Order {
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    fecha_creacion:Date;

    @Column({nullable:false,default:''})
    cliente:string;
    
    @Column({nullable:false,default:''})
    direccion:string;
    
    @Column({nullable:false,default:''})
    telefono:string;
    
    @Column({nullable:false,default:''})
    email:string;
    
    @Column({nullable:false,default:''})
    no_guia:string;
    
    @Column({nullable:false,default:''})
    nit_cliente:string;
    
    @Column({nullable:false,default:''})
    no_factura:string;
    
    @Column({nullable:false,default:0, type: 'varchar'})
    total:number;

    @Column({nullable:true})
    fecha_entrega:Date;

    @Column({nullable:true})
    fecha_confirmacion:Date;

    @Column({name:'tipo_orden_id',default:TipoOrden.POS})
    tipo_orden:number;

    @ManyToOne(()=>DeliveryType)
    @JoinColumn({name:'tipo_entrega_id'})
    tipo_entrega:DeliveryType;
    
    @ManyToOne(()=>OrderStatus)
    @JoinColumn({name:'estado_orden_id'})
    estado_orden:OrderStatus;
    
    @ManyToOne(()=>PaymentMethod)
    @JoinColumn({name:'metodo_pago_id'})
    metodo_pago:PaymentMethod;

    @ManyToOne(()=>User)
    @JoinColumn({name:'vendedor_id'})
    vendedor:User;

    @ManyToOne(()=>Shipping)
    @JoinColumn({name:'envio_id'})
    envio:Shipping;

    @OneToMany(type=>ProductOrder,prod => prod.orden)
    productos: ProductOrder[];

}
