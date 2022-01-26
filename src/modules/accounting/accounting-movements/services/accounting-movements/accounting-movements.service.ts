import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transforPropToString } from 'src/constants';
import { Repository } from 'typeorm';
import { CreateAccountingMovementDto } from '../../dto/accounting-movements/create-accounting-movement.dto';
import { UpdateAccountingMovementDto } from '../../dto/accounting-movements/update-accounting-movement.dto';
import { AccountingMovement } from '../../entities/accounting-movement.entity';

@Injectable()
export class AccountingMovementsService {

  constructor(@InjectRepository(AccountingMovement) private repository:Repository<AccountingMovement>){}

  async create(createAccountingMovementDto: CreateAccountingMovementDto,sucursal_id:number) {
    createAccountingMovementDto.fecha = new Date();
    createAccountingMovementDto['sucursal'] = sucursal_id;
    return this.repository.save(createAccountingMovementDto);
  }

  async findAll(sucursal_id) {
    let response = await this.repository.createQueryBuilder('mov')
      .leftJoinAndSelect('mov.partida','partida')
      .leftJoinAndSelect('mov.tipo_movimiento','tipo_movimiento')
      .leftJoinAndSelect('mov.usuario','usuario')
      .leftJoin('mov.sucursal','sucursal')
      .where('sucursal.id = :sucursal_id',{sucursal_id})
      .orderBy('mov.id')
      .getMany();
      transforPropToString(response,'partida',['nombre'])
      transforPropToString(response,'tipo_movimiento',['nombre'])
      transforPropToString(response,'usuario',['nombre','apellido'])
      return response;
  }

  async findOne(id: number) {
    let response = await this.repository.createQueryBuilder('mov')
      //.leftJoinAndSelect('acc.tipo_partida','tipo')
      //.where('acc.id = :id',{id})
      .getOne();
      //transforPropToString(response,'tipo_partida',['id'])
      return response;
  }

  async update(id: number, updateAccountingMovementDto: UpdateAccountingMovementDto) {
    return (await this.repository.update(id, updateAccountingMovementDto)).affected;
  }

  async remove(id: number) {
    return (await this.repository.delete(id)).affected;
  }
}
