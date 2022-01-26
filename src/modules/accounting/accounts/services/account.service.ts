import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountService {
    constructor(@InjectRepository(Account) private repository:Repository<Account>){}

  /**
   * Crear una cuenta
   * @param create
   */
  async create(create: CreateAccountDto) {
    return this.repository.save(create);
    }

  /**
   * Obtener todas las partidas
   */
  async findAll() {
    return await this.repository.find({ relations: ['tipo_cuenta'] });
    }

  /**
   * Obtener una cuenta
   * @param id
   */
  async findOne(id: number) {
      return this.repository.findOne(id,{relations:['tipo_cuenta']})
    }

  /**
   * Actualizar una cuenta
   * @param id
   * @param update
   */
  async update(id: number, update: UpdateAccountDto) {
    return (await this.repository.update(id, update)).affected;
    }

  /**
   * Eliminar una cuenta
   * @param id
   */
  async remove(id: number) {
     try {
       return (await this.repository.delete(id)).affected;
     } catch (e){
       throw  new HttpException('No se puede eliminar la cuenta',HttpStatus.CONFLICT)
     }
    }

  /**
   * Obtener el nombre y el id de la cuenta
   */
  async findAllToFill() {
      return this.repository.find({select:['id','nombre'],where:{
        err:1
        }})
    }

  /**
   * Ocultar las cuentas
   */
  async showAccount(id:string){
    return this.repository.update(id,{err:1})
    }

  /**
   * Mostrar cuentas
   */
  async hideAccount(id:string){
    return this.repository.update(id,{err:0})
    }
}
