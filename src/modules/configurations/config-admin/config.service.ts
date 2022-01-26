import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CLAVE_ADMINISTRADOR } from 'src/constants';
import { Repository } from 'typeorm';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Config } from './entities/config.entity';
import { EmailConfigDto } from './dto/email-config.dto';
import { ConfigEcommerce } from '../config-ecommerce/entities/config-ecommerce.entity';
import { ServerEmailDto } from './dto/server-email.dto';
import { NotificationMailConfigDto } from './dto/notification-mail-config.dto';
import { QuotesTemplateDto } from './dto/quotes-template.dto';

@Injectable()
export class ConfigService {
  //id de configuracion
  id:number = 1;
  constructor(@InjectRepository(Config) private repository:Repository<Config>,
              @InjectRepository(ConfigEcommerce) private repositoryConfige:Repository<ConfigEcommerce>){}


  /**
   * Obtener la configuración
   */
  async findOne() {
    const value = await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.CONFLICT);
    }
    return this.repository.findOne(this.id);
  }

  async findEcommerce(){
    return this.repositoryConfige.findOne(this.id);
  }
  /**
   * Actualizar la configuración
   * @param updateConfigDto
   */
  async update( updateConfigDto: UpdateConfigDto) {
    const value = await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.CONFLICT);
    }
    if(updateConfigDto.claveAdministrador !== CLAVE_ADMINISTRADOR){
      throw new HttpException('Clave de administrador incorrecta',HttpStatus.CONFLICT);
    }
    delete updateConfigDto.claveAdministrador;
    return this.repository.update(this.id,updateConfigDto);
  }

  /**
   * Actualizar el correo de notificaciones
   * @param emailconfig
   */
  async updateEmailConfig(emailconfig:EmailConfigDto){
    return (await this.repository.update(this.id,{email_notificaciones:emailconfig.email_notificaciones})).affected
  }

  /**
   * Actualizar el correo de notificaciones
   */
  async getEmailConfig(){
    return this.repository.findOne(this.id,{select:['email_notificaciones']});
  }

  /**
   * Actualizar la información del server del correo
   * @param emailconfig
   */
  async updateServerEmailConfig(emailconfig:ServerEmailDto){
    return (await this.repository.update(this.id,emailconfig)).affected
  }

  /**
   * Obtener la información del server de correo
   */
  async getServerEmailConfig(){
    return this.repository.findOne(this.id,{select:['email_host','email_puerto']});
  }

  /**
   * Actualizar la información del server del correo
   * @param emailconfig
   */
  async updateNotiEmailConfig(emailconfig:NotificationMailConfigDto){
    return (await this.repository.update(this.id,emailconfig)).affected
  }

  /**
   * Obtener la información del server de correo
   */
  async getNotiEmailConfig(){
    return this.repository.findOne(this.id,{select:['email_send_user']});
  }

  /**
   * Obtener las plantillas de pdf y correo para cotizaciones
   */
  async getTemplatesQuote(){
    return this.repository.findOne(this.id,{select:[
      'plantilla_cotizacion_encabezado_pagina','plantilla_cotizacion_terminos_pago',
      'plantilla_cotizacion_condiciones','plantilla_cotizacion_pie_pagina',
      'plantilla_cotizacion_garantia','plantilla_cotizacion_email_mensaje',
      'plantilla_cotizacion_email_firma']})
  }


  /**
   * Actualizar las plantillas
   * @param template
   */
  async updateTemplatesQuote(template:QuotesTemplateDto){
    return (await  this.repository.update(this.id,template)).affected
  }

}
