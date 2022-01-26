import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { CANT_ROL_ADMIN, Roles, transforPropToString } from 'src/constants';
import { RolUser } from '../../entities/rol.entity';
import { StatuslUser } from '../../entities/user-status.entity';
import { updateUserDto } from '../../dtos/update-user.dto';
import { AccessLogService } from '../access-log.service';
import { SendMailService } from '../../../../services/mailer/send-mail.service';

@Injectable()
export class UsersService {
  saltOrRounds: number = 10;
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(RolUser) private rolesRepository: Repository<RolUser>,
    @InjectRepository(StatuslUser)
    private statusRepository: Repository<StatuslUser>,
    private logservice: AccessLogService,
    private email: SendMailService,
  ) {}

  /**
   * Obtener una lista de usuarios administrativos
   */
  async findAll() {
    let result = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.nombre',
        'user.apellido',
        'user.telefono',
        'user.direccion',
        'user.id',
        'rol.nombre as rol',
        'sucursal.nombre',
        'rol.nombre',
      ])
      .leftJoin('user.rol', 'rol')
      .leftJoin('user.sucursal', 'sucursal')
      .where('user.id > 1')
      .andWhere('rol.id <= ' + CANT_ROL_ADMIN)
      .getMany();
    transforPropToString(result, 'rol', ['nombre']);
    transforPropToString(result, 'sucursal', ['nombre']);
    return result;
  }

  /**
   * Obtener un usuario para mostrar información
   * @param id
   */
  async findOne(id: string): Promise<any> {
    let result = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.rol', 'rol')
      .leftJoinAndSelect('user.sucursal', 'sucursal')
      .leftJoinAndSelect('user.estado', 'estado')
      .where('user.id = :id', { id })
      .getOne();
    delete result.contrasenia;
    delete result.fecha_confirmacion;
    delete result.hash;

    return result;
  }

  /**
   * crear un nuevo usuario
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    //verificar si existe nombre de usuario
    if (
      await this.usersRepository.findOne({
        nombre_usuario: createUserDto.nombre_usuario,
      })
    ) {
      throw new HttpException(
        'El nombre de usuario ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    //cifrar contraseña
    var password = createUserDto.contrasenia;
    if (!password) {
      //generar contraseña
      password = UsersService.generatePasswordRand(8, 'alf');
    }
    createUserDto.contrasenia = await bcrypt.hash(password, this.saltOrRounds);
    createUserDto['estado'] = await this.statusRepository.findOne(1);
    createUserDto['fecha_registro'] = new Date();
    createUserDto['fecha_confirmacion'] = new Date();
    var usr = await this.usersRepository.save({
      ...createUserDto,
      genero: createUserDto.genero == '1',
    });
    //enviar contraseña cifrada
    await this.email.sendConfirmAccountAdmin(
      usr.nombre + ' ' + usr.apellido,
      usr.email,
      usr.nombre_usuario,
      password,
    );
    // this.email.sendTest();
    return {
      usr: usr.nombre_usuario,
      password_generated: password,
    };
  }

  /**
   * Actualizar usuario
   * @param id
   * @param createUserDto
   */
  async update(id: number, createUserDto: updateUserDto) {
    //verificar si existe nombre de usuario
    let user: User = await this.usersRepository.findOne(id);
    if (user) {
      if (user.id != id) {
        throw new HttpException(
          'El nombre de usuario ya existe',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    } else {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }
    return (
      await this.usersRepository.update(id, {
        ...createUserDto,
        genero: createUserDto.genero == '1',
      })
    ).affected;
  }

  /**
   * Obtener un usuario
   * @param id
   */
  async findOneClear(id) {
    return await this.usersRepository.findOne(id);
  }

  /**
   * Obtener usuarios administrativos
   */
  async findtoFill() {
    const fill = await this.usersRepository
      .createQueryBuilder('obj')
      .select(['obj.id', 'obj.nombre', 'obj.apellido'])
      .leftJoin('obj.rol', 'rol')
      .where('obj.rol < ' + Roles.CLIENTE)
      .getMany();
    return fill;
  }

  /**
   * Obtener la lista de roles administrativos
   */
  async findRolesToFill() {
    return await this.rolesRepository
      .createQueryBuilder('obj')
      .select(['obj.id', 'obj.nombre'])
      .where('obj.id <= ' + CANT_ROL_ADMIN)
      .getMany();
  }

  /**
   * Obtener la lista de estados administrativos
   */
  async findStatusToFill() {
    return await this.statusRepository.find();
  }

  /**
   * Actualizar con una contraseña random
   * @param idUsuario
   * @constructor
   */
  async SetRandomPassword(idUsuario: number) {
    const randomPassword = UsersService.generatePasswordRand(8, 'alf');
    const pass = await bcrypt.hash(randomPassword, this.saltOrRounds);
    await this.usersRepository.update(idUsuario, { contrasenia: pass });
    return { contrasenia: randomPassword };
  }

  /**
   * Generar una contraseña aleatoria
   * @param length
   * @param type
   * @private
   */
  private static generatePasswordRand(length, type) {
    var characters;
    switch (type) {
      case 'num':
        characters = '0123456789';
        break;
      case 'alf':
        characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
      case 'rand':
        //FOR ↓
        break;
      default:
        characters =
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        break;
    }
    var pass = '';
    let i;
    for (i = 0; i < length; i++) {
      if (type == 'rand') {
        pass += String.fromCharCode(
          (Math.floor(Math.random() * 100) % 94) + 33,
        );
      } else {
        pass += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }
    }
    return pass;
  }

  /**
   * Obtener una lista de accesos de usuarios a la aplicación
   */
  async getLogs() {
    return this.logservice.getLog();
  }

  getIdSucursal(user: string) {
    const query = `select sucursal_id from usuario WHERE usuario.nombre_usuario = '${user}';`;
    return this.usersRepository.query(query);
  }
}
