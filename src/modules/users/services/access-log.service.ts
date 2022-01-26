import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessLog } from '../entities/access-log.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AccessLogService {

  constructor(@InjectRepository(AccessLog) private repository:Repository<AccessLog>) {
  }

  /**
   * Almacenar acceso de usuario
   * @param usuario
   */
  saveLogin(usuario:User){
    return this.repository.save({
      fecha_hora:new Date(),
      isLogin:true,
      usuario: usuario
    });
  }

  /**
   * Almacenar logout del usuario
   * @param usuario
   */
  saveLogout(usuario:User){
    return this.repository.save({
      fecha_hora:new Date(),
      isLogin:false,
      usuario: usuario
    });
  }

  /**
   * Obtener la lista de accesos de los usuarios a la plataforma
   */
  async getLog(){
    let result:AccessLog[] = await this.repository.createQueryBuilder('log')
      .select(['log.fecha_hora','log.isLogin',
        'usuario.id','usuario.nombre','usuario.apellido',
      'sucursal.nombre'])
      .leftJoin('log.usuario','usuario')
      .leftJoin('usuario.sucursal','sucursal')
      .getMany();
    let newResult = [];
    result.forEach(value => {
      newResult.push({
        id:value.id,
        isLogin:value.isLogin,
        fecha_hora:value.fecha_hora,
        usuario:value.usuario?value.usuario.nombre+' '+value.usuario.apellido:'',
        usuario_id:value.usuario?value.usuario.id:'',
        sucursal:value.usuario?value.usuario.sucursal?value.usuario.sucursal.nombre:'':''
      })
    })
    return newResult;
  }

}
