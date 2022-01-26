import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from '../../dtos/jwt-payload.dto';
import { RegisterUserDto } from '../../dtos/register-user.dto';
import { RolUser } from '../../entities/rol.entity';
import { StatuslUser } from '../../entities/user-status.entity';
import { CRYPTO_SECRET, EstadosUsuario, Roles } from 'src/constants';
import { SuscriptorUserDto } from '../../dtos/new-suscriptor.dto';
import { ConfirmAccountDto } from '../../dtos/confirm-account.dto';
import { NewPasswordDto } from '../../dtos/new-password.dto';
import { AccessLogService } from '../access-log.service';
import { SendMailService } from '../../../../services/mailer/send-mail.service';
import { FreeContactDto } from '../../../configurations/config-admin/dto/free-contact.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(RolUser) private rolesRepository: Repository<RolUser>,
    @InjectRepository(StatuslUser)
    private statusRepository: Repository<StatuslUser>,
    private jwtService: JwtService,
    private logService: AccessLogService,
    private email: SendMailService,
  ) {}
  saltOrRounds: number = 10;

  /**
   * Verificar usuario y contraseña en usuarios administrativos
   * @param nombre_usuario
   * @param contrasenia
   */
  async login(nombre_usuario: string, contrasenia: string): Promise<any> {
    const user = await this.usersRepository.findOne(
      { nombre_usuario: nombre_usuario },
      { relations: ['rol', 'sucursal'] },
    );
    if (user) {
      const isMatch = await bcrypt.compare(contrasenia, user.contrasenia);
      if (isMatch) {
        const token = await this.getAccessToken(user);
        //log de acceso
        await this.logService.saveLogin(user);
        return {
          nombre: user.nombre + ' ' + user.apellido,
          email: user.email,
          nombre_usuario: user.nombre_usuario,
          nombre_rol: user.rol.nombre,
          imagen: user.imagen,
          rol: user.rol.id,
          sucursal: user.sucursal ? user.sucursal.nombre : '',
          idSucursal: user.sucursal.id,
          token,
        };
      } else {
        throw new HttpException(
          'Contraseña incorrecta',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        'El nombre de usuario no existe',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Verificar usuario y contraseña en usuarios del e-commerce
   * @param nombre_usuario
   * @param contrasenia
   */
  async login_ecommerce(
    nombre_usuario: string,
    contrasenia: string,
  ): Promise<any> {
    const user = await this.usersRepository.findOne(
      { email: nombre_usuario },
      { relations: ['rol', 'estado'] },
    );
    if (user) {
      const isMatch = await bcrypt.compare(contrasenia, user.contrasenia);
      if (isMatch) {
        if (Roles.CLIENTE == user.rol.id) {
          if (user.estado.id == EstadosUsuario.ACTIVO) {
            const token = await this.getAccessToken(user);
            return {
              /*nombre: user.nombre + ' ' + user.apellido,
              userId: user.id,
              imagen: user.imagen,*/
              token,
            };
          } else {
            throw new HttpException(
              'La cuenta se encuentra inactiva',
              HttpStatus.BAD_REQUEST,
            );
          }
        } else {
          throw new UnauthorizedException();
        }
      } else {
        throw new HttpException('Contraseña incorrecta', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException(
        'El correo electrónico no existe',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Generar el token de acceso para iniciar sesión
   * @param user
   */
  async getAccessToken(user: User) {
    const payload: JWTPayload = {
      id: '' + user.id,
      rol: user.rol.id,
      sucursal: user.sucursal ? user.sucursal.id : -1,
    };
    return this.jwtService.sign(payload);
  }

  /**
   * Registrar un usuario de tipo cliente
   * @param createUserDto
   */
  async register(createUserDto: RegisterUserDto) {
    //verificar si existe el cocrreo
    if (
      await this.usersRepository.findOne({
        email: createUserDto.email,
      })
    ) {
      throw new HttpException(
        'El correo electrónico ya está registrado',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    //cifrar contraseña
    const saltOrRounds = 10;
    var password = createUserDto.contrasenia;
    createUserDto.contrasenia = await bcrypt.hash(password, saltOrRounds);
    let hash = await this.getRandomToken(createUserDto.email);
    createUserDto['hash'] = hash;
    createUserDto['estado'] = await this.statusRepository.findOne(
      EstadosUsuario.INACTIVO,
    );
    createUserDto['fecha_registro'] = new Date();
    createUserDto['hash'] = hash;
    await this.usersRepository.save({
      ...createUserDto,
      nombre_usuario: createUserDto.email,
      rol: await this.rolesRepository.findOne(Roles.CLIENTE),
    });
    await this.email.sendConfirmAccount(
      createUserDto.email,
      `${createUserDto.nombre} ${createUserDto.apellido}`,
      hash,
    );
    return 'Ok';
  }

  /**
   * Registrar un usuario de tipo cliente
   * @param createUserDto
   */
  async regSuscriptor(createUserDto: SuscriptorUserDto) {
    //verificar si existe el cocrreo
    if (
      await this.usersRepository.findOne({
        email: createUserDto.email,
      })
    ) {
      throw new HttpException(
        'El correo electrónico ya está registrado',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    createUserDto['estado'] = await this.statusRepository.findOne(
      EstadosUsuario.INACTIVO,
    );
    await this.usersRepository.save({
      ...createUserDto,
      nombre: '',
      apellido: '',
      contrasenia: '',
      nombre_usuario: createUserDto.email,
      fecha_registro: new Date(),
      rol: await this.rolesRepository.findOne(Roles.SUSCRIPTOR),
    });
    //enviar contraseña cifrada
    return 'Ok';
  }

  /**
   * Obtiene una clave hash basada en el correo electrónico del nuevo usuario
   * @param email
   */
  async getRandomToken(email: string) {
    return crypto
      .createHmac('sha256', CRYPTO_SECRET)
      .update(email)
      .digest('hex');
  }

  /**
   * Realiza la confirmación de la cuenta
   * @param body
   */
  async confirmAccount(body: ConfirmAccountDto) {
    const user: User = await this.usersRepository.findOne({
      where: { hash: body.key },
    });
    if (user) {
      //actualizar
      user.estado = await this.statusRepository.findOne(EstadosUsuario.ACTIVO);
      user.hash = null;
      user.fecha_confirmacion = new Date();
      await user.save();
      return 'OK';
    } else {
      throw new HttpException(
        'Solicitud de Confirmación Inválida',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Asigna una clave hash la enviar por correo electrónico para identificar la cuenta y
   * cambiar contraseña
   * @param email
   */
  async resetPassword(email: string) {
    const user: User = await this.usersRepository.findOne({
      where: { email: email },
    });
    //console.log(user)
    if (!user) {
      throw new HttpException('La cuenta no existe', HttpStatus.NOT_FOUND);
    }
    let hash = await this.getRandomToken(user.email);
    user.hash = hash;
    await user.save();
    await this.email.sendResetPassword(
      user.email,
      `${user.nombre} ${user.apellido}`,
      hash,
    );
  }

  /**
   * Asigna la nueva contraseña si la hash es valida
   * @param newPassword
   */
  async newPassword(newPassword: NewPasswordDto) {
    const user: User = await this.usersRepository.findOne({
      where: { hash: newPassword.key },
    });
    if (!user) {
      throw new HttpException('Enlace incorrecto', HttpStatus.NOT_FOUND);
    }
    user.hash = null;
    user.contrasenia = await bcrypt.hash(
      newPassword.newPassword,
      this.saltOrRounds,
    );
    await user.save();
  }

  /**
   * Registra el cierre de sesión de un usuario
   * @param idUsuario
   */
  async logout(idUsuario: number) {
    const user: User = await this.usersRepository.findOne(idUsuario);
    if (!user) {
      throw new HttpException('No existe el usuario', HttpStatus.NOT_FOUND);
    }
    return await this.logService.saveLogout(user);
  }

  /**
   * Enviar correo de contacto
   * @param body
   */
  async sendContact(body: FreeContactDto) {
    await this.email.sendContactMail(body);
    return 'ok';
  }
}
