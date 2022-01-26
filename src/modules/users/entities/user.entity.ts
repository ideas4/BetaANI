import { Store } from 'src/modules/stores/entities/store.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, JoinColumn, BaseEntity } from 'typeorm';
import { RolUser } from './rol.entity';
import { StatuslUser } from './user-status.entity';

@Entity({name:'usuario'})
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:false})
  nombre: string;

  @Column({nullable:false})
  apellido: string;

  @Column({nullable:false})
  email: string;
  
  @Column({nullable:false,unique:true})
  nombre_usuario: string;

  @Column({nullable:false})
  contrasenia: string;

  @Column({nullable:true})
  telefono: string;

  @Column({nullable:true})
  direccion: string;

  @Column({nullable:false,default:'default-user.jpg'})
  imagen: string;

  @Column({nullable:true})
  genero: boolean;

  @Column({nullable:true})
  fecha_nacimiento: Date;

  @Column({default:null,nullable:true})
  fecha_registro: Date;

  @Column({default:null,nullable:true})
  fecha_confirmacion: Date;

  @Column({ default: null,nullable:true })
  hash: string;

  @ManyToOne(type => Store,store =>store.usuarios)
  @JoinColumn({name:'sucursal_id'})
  sucursal: Store;

  @ManyToOne(type=>RolUser,{nullable:false})
  @JoinColumn({name:'rol_id'})
  rol: RolUser;

  @ManyToOne(type=>StatuslUser,{nullable:false})
  @JoinColumn({name:'status_id'})
  estado: StatuslUser;

}