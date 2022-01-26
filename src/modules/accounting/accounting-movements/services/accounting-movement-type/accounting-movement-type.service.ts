import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountingMovementTypeDto } from '../../dto/accounting-movement-type/create-accounting-movement-type.dto';
import { UpdateAccountingMovementTypeDto } from '../../dto/accounting-movement-type/update-accounting-movement-type.dto';
import { AccountingMovementType } from '../../entities/accounting-movement-type.entity';
@Injectable()
export class AccountingMovementTypeService {
  constructor(@InjectRepository(AccountingMovementType) private repository:Repository<AccountingMovementType>){}

  async create(createAccountingItemTypeDto: CreateAccountingMovementTypeDto) {
    if ( !(await this.repository.findOne({ nombre: createAccountingItemTypeDto.nombre }))) {
      return this.repository.save(createAccountingItemTypeDto);
    } else {
      throw new HttpException(
        'El tipo de movimiento ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, updateAccountingItemTypeDto: UpdateAccountingMovementTypeDto) {
    const inst = await this.repository.findOne({nombre: updateAccountingItemTypeDto.nombre});
    if(!inst || inst.id == id){
      return (await this.repository.update(id, updateAccountingItemTypeDto)).affected;
    } else {
      throw new HttpException(
        'El tipo de movimiento ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async remove(id: number) {
    return (await this.repository.delete(id)).affected;
  }

  async findToFill(){
    return this.repository.find({});
  }
}
