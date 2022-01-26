import { Supplier } from "src/modules/suppliers/entities/supplier.entity";
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Brand } from "../brands/entities/brand.entity";
import { Category } from "../categories/entities/category.entity";
import { Color } from "../colors/entities/color.entity";
import { SpecProduct } from "../specs/entities/spec-product.entity";
import { ImageProduct } from "./img-product.entity";
import { Inventory } from "../../inventory/entities/inventory.entity";

@Entity({name:'producto'})
export class Product extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    sku:string;

    @Column({nullable:false})
    nombre:string;

    @Column({nullable:true,type:'text'})
    descripcion:string;

    @Column({nullable:false,default:0,type: 'varchar'})
    precio_original:number;

    @Column({nullable:false,default:0,type: 'varchar'})
    precio_venta:number;

    @Column({nullable:false,default:0,type: 'varchar'})
    precio_min:number;

    @Column({nullable:false,default:false})
    destacado:boolean;

    @Column({nullable:false})
    fecha_creacion:Date;

    @Column({nullable:false,default:true})
    showInStore:boolean;

    @Column({nullable:false,default:false})
    isDeleted:boolean;

    @Column({type: 'varchar', nullable: true})
    bos: string;

    @Column({type: 'varchar', nullable: true})
    ultimo_costo: string;

    @Column({type: 'varchar', nullable: true})
    costo_promedio: string;

    @Column({type: 'varchar', nullable: true})
    fabricante: string;

    @Column({type: 'varchar', nullable: true})
    division: string;

    @Column({type: 'varchar', nullable: true})
    sub_division: string;

    @Column({type: 'varchar', nullable: true})
    material: string;

    @Column({type: 'varchar', nullable: true})
    medida: string;

    @Column({type: 'varchar', nullable: true})
    capacidad: string;

    @Column({type: 'varchar', nullable: true})
    embalaje: string;

    @Column({type: 'varchar', nullable: true})
    USERDEF_1: string;

    @Column({type: 'varchar', nullable: true})
    USERDEF_2: string;

    @Column({type: 'varchar', nullable: true})
    USERDEF_3: string;

    @Column({type: 'varchar', nullable: true})
    USERDEF_4: string;

    
    @Column({nullable:false,default:0})
    contador_visitas:number;

    @ManyToOne(() => Brand,brand=>brand.products)
    @JoinColumn({name:'marca_id'})
    marca: Brand;

    @ManyToOne(() => Supplier)
    @JoinColumn({name:'proveedor_id'})
    proveedor: Brand;

    @ManyToOne(() => Color)
    @JoinColumn({name:'color_id'})
    color: Color;

    @ManyToMany(() => Category)
    @JoinTable({name:'categoria_producto',joinColumn:{name:'producto_id'},
    inverseJoinColumn:{name:'categoria_id'}})
    categorias: Category[];

    @OneToMany(() => ImageProduct, img=>img.producto)
    imagenes: ImageProduct[];

    @OneToMany(inv=>Inventory,inv=>inv.producto)
    inventario:Inventory[];

    @OneToMany(inv=>SpecProduct,inv=>inv.producto)
    especificaciones: SpecProduct[];
}
