import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountTypeDto } from '../dto/create-account-type.dto';
import { UpdateAccountTypeDto } from '../dto/update-account-type.dto';
import { AccountType } from '../entities/account-type.entity';

@Injectable()
export class AccountTypeService {

  constructor(@InjectRepository(AccountType) private repository:Repository<AccountType>){}

  /**
   * Crear tipo de cuenta
   * @param create
   */
  async create(create: CreateAccountTypeDto) {
    if ( !(await this.repository.findOne({ nombre: create.nombre }))) {
      return this.repository.save(create);
    } else {
      throw new HttpException(
        'El tipo de cuenta ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  /**
   * Obtener todas las partidas
   */
  findAll() {
    return this.repository.find();
  }

  /**
   * Obtener una cuenta en especifico
   * @param id
   */
  findOne(id: number) {
    return this.repository.findOne(id);
  }

  /**
   * Actualizar un tipo de cuenta
   * @param id
   * @param update
   */
  async update(id: number, update: UpdateAccountTypeDto) {
    const inst = await this.repository.findOne({nombre: update.nombre});
    if(!inst || inst.id == id){
      return (await this.repository.update(id, update)).affected;
    } else {
      throw new HttpException(
        'El tipo de cuenta ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  /**
   * Eliminar el tipo de cuenta
   * @param id
   */
  async remove(id: number) {
    try {
      return (await this.repository.delete(id)).affected;
    }catch (e){
      throw  new HttpException('No se puede eliminar el tipo de cuenta',HttpStatus.CONFLICT);
    }
  }

  /**
   * Obtener id y nombre
   */
  async findToFill(){
    return this.repository.find({select:['id','nombre']});
  }
}
