import { Injectable } from '@nestjs/common';
import { CreateLogBookDto } from './dto/create-log-book.dto';
import { UpdateLogBookDto } from './dto/update-log-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LogBook } from './entities/log-book.entity';
import { Between, Repository } from 'typeorm';
import { Deposit } from '../deposits/entities/deposit.entity';
import { Check } from '../checks/entities/check.entity';
import { SaleEntity } from '../../sales/entities/sale.entity';
import { MoneyWithdraw } from '../money-withdraw/entities/money-withdraw.entity';

@Injectable()
export class LogBookService {

  constructor(@InjectRepository(LogBook) private repository:Repository<LogBook>) {
  }

  /**
   * Obtiene todos los registros del libro diario por dia
   */
  async getAllByDay(){
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);
    let result:any[] = await this.repository.find({relations:['cheque','cuenta','cuenta.tipo_cuenta','venta','deposito',
      'usuario','retiro'], where:{
      fecha:Between(start,end)
      }})

    result.forEach(value => {
      value.usuario = value.usuario? value.usuario.nombre+' '+value.usuario.apellido:''
    })
    return result;
  }

  /**
   * Obtiene todos los registros del libro diario
   */
  async getAll(){
    let result:any[] = await this.repository.find({relations:['cheque','cuenta','cuenta.tipo_cuenta','venta','deposito',
        'usuario','retiro']})

    result.forEach(value => {
      value.usuario = value.usuario? value.usuario.nombre+' '+value.usuario.apellido:''
    })
    return result;
  }

  /**
   * Crear registro de deposito
   * @param createLogBookDto
   * @param deposit
   */
  registerDeposit(createLogBookDto: CreateLogBookDto,deposit:Deposit) {
    return this.repository.save({...createLogBookDto,deposito:deposit});
  }

  /**
   * Crear registro de cheque
   * @param createLogBookDto
   * @param cheque
   */
  registerCheck(createLogBookDto: CreateLogBookDto,cheque:Check) {
    return this.repository.save({...createLogBookDto,cheque:cheque});
  }x

  /**
   * Crear registro de venta
   * @param createLogBookDto
   * @param venta
   */
  registerSale(createLogBookDto: CreateLogBookDto,venta:SaleEntity) {
    return this.repository.save({...createLogBookDto,venta:venta});
  }

  /**
   * Crear registro de retiro
   * @param createLogBookDto
   * @param moneyw
   */
  registerWithdrawal(createLogBookDto: CreateLogBookDto,moneyw:MoneyWithdraw) {
    return this.repository.save({...createLogBookDto,retiro:moneyw});
  }
}
