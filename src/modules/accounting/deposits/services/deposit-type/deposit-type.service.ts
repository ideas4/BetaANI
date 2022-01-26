import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDepositTypeDto } from '../../dto/create-deposit-type.dto';
import { UpdateDepositTypeDto } from '../../dto/update-deposit-type.dto';
import { DepositType } from '../../entities/deposit-type.entity';

@Injectable()
export class DepositTypeService {

  constructor(@InjectRepository(DepositType) private repository:Repository<DepositType>){}

  /**
   * Crear un tipo de deposito
   * @param createDepositTypeDto
   */
  async create(createDepositTypeDto: CreateDepositTypeDto) {
   if(!await this.repository.findOne({nombre:createDepositTypeDto.nombre})){
      return this.repository.save(createDepositTypeDto);
   }else{
     throw new HttpException('El tipo de déposito existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  /**
   * Obtener una lista de depositos
   */
  findAll() {
    return this.repository.find();
  }

  /**
   * Obtener un tipo de deposito
   * @param id
   */
  findOne(id: number) {
    return this.repository.findOne(id);
  }

  /**
   * Actualizar un tipo de deposito
   * @param id
   * @param updateDepositTypeDto
   */
  async update(id: number, updateDepositTypeDto: UpdateDepositTypeDto) {
    const inst = await this.repository.findOne({nombre:updateDepositTypeDto.nombre});
    if(!inst || inst.id == id){
      return (await this.repository.update(id,updateDepositTypeDto)).affected;
    }else{
     throw new HttpException('El tipo de déposito ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  /**
   * Eliminar tipo de depósito
   * @param id
   */
  async remove(id: number) {
    try {
      return (await this.repository.delete(id)).affected;
    }catch (e) {
      throw  new HttpException('No se eliminó correctamente el tipo de depósito',HttpStatus.CONFLICT)
    }
  }

  /**
   * Obtener una lista de tipos de depositos
   */
  findtoFill(){
    return this.repository.find();
  }
}
