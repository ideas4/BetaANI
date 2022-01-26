import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Bank } from './entities/bank.entity';

@Injectable()
export class BanksService {

  constructor(@InjectRepository(Bank) private repository:Repository<Bank>){}

  /**
   * Crear un banco
   * @param createBankDto
   */
  async create(createBankDto: CreateBankDto) {
    if(!await this.repository.findOne({nombre:createBankDto.nombre})){
      return this.repository.save(createBankDto);
   }else{
     throw new HttpException('El banco ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  /**
   * Obtener lista de bancos
   */
  findAll() {
    return this.repository.find();
  }

  /**
   * Obtener un banco
   * @param id
   */
  findOne(id: number) {
    return this.repository.findOne(id);
  }

  /**
   * Actualizar banco
   * @param id
   * @param updateBankDto
   */
  async update(id: number, updateBankDto: UpdateBankDto) {
    const inst = await this.repository.findOne({nombre:updateBankDto.nombre});
    if(!inst || inst.id == id){
      return (await this.repository.update(id,updateBankDto)).affected;
    }else{
     throw new HttpException('El banco ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  /**
   * Eliminar Banco
   * @param id
   */
  async remove(id: number) {
    try {
      return (await this.repository.delete(id)).affected;
    }catch (e){
      throw new HttpException('El banco no se eliminó correctamente',HttpStatus.CONFLICT);
    }
  }
}
