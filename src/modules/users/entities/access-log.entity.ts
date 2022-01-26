import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('log_acceso')
export class AccessLog {

  @PrimaryGeneratedColumn()
  id:number;

  @Column({type:'datetime',nullable:false})
  fecha_hora:Date;

  @Column({type:'boolean',name:'tipo',nullable:false,default:true})
  isLogin:Date;

  @ManyToOne(type => User)
  @JoinColumn({name:'usuario_id'})
  usuario:User;

}
