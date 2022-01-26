import internal from "stream";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'cliente'})
export class Customer {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:false})
    nombre_completo:string;

    @Column()
    direccion:string;

    @Column()
    telefono:string;

    @Column()
    email:string;

    @Column()
    nit:string;

    @Column()
    notas:string;

    @Column()
    fecha_creacion:Date;

    @Column({type: 'varchar', nullable: true})
    cp_receptor: string;
    
    @Column({type: 'varchar', nullable: true})
    municipio_receptor: string;

    @Column({type: 'varchar', nullable: true})
    depto_receptor: string;

    @Column({type: 'varchar', nullable: true})
    pais_receptor: string;

    @Column({type: 'int', nullable: true})
    vendedor: number;

    @Column({type: 'int', nullable: true})
    supervisor: number;

    @Column({type: 'varchar', nullable: true})
    ruta: string

    @Column({type: 'int', nullable: true})
    condicion_pago: number;

    @Column({type: 'varchar', nullable: true})
    limite_credito: string;

    @Column({type: 'varchar', nullable: true})
    moneda: string;

    @Column({type: 'varchar', nullable: true})
    metodo_envio: string;

    @Column({type: 'varchar', nullable: true})
    clase_cliente: string;

    @Column({type: 'tinyint', nullable: true})
    estado: boolean;

    @Column({type: 'varchar', nullable: true})
    contacto_comercial: string;

    @Column({type: 'varchar', nullable: true})
    contacto_financiero: string;

    @Column({type: 'varchar', nullable: true})
    USERDEF_1: string;

    @Column({type: 'varchar', nullable: true})
    USERDEF_2: string;

    @Column({type: 'varchar', nullable: true})
    USERDEF_3: string;

    @Column({type: 'varchar', nullable: true})
    USERDEF_4: string;

}
