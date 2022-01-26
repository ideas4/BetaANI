import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDepositDto } from '../../dto/create-deposit.dto';
import { Deposit } from '../../entities/deposit.entity';
import { LogBookService } from '../../../log-book/log-book.service';
import { BankAccount } from '../../../bank-accounts/entities/bank-account.entity';

@Injectable()
export class DepositsService {
  
  constructor(@InjectRepository(Deposit) private repository:Repository<Deposit>,
              @InjectRepository(BankAccount) private repositoryAccountb:Repository<BankAccount>,
              private logBookService:LogBookService){}

  /**
   * Registrar depósito
   * @param createDepositDto
   * @param id_usuario
   */
  async create(createDepositDto: CreateDepositDto,id_usuario:string) {
    if(await this.repository.count({where:{no_boleta:createDepositDto.no_boleta}}) > 0){
      throw new HttpException('El No. de boleta ya existe',HttpStatus.BAD_REQUEST)
    }
    createDepositDto['fecha'] = new Date();
    createDepositDto['usuario'] = id_usuario;
    //contabilidad
    let cuenta = createDepositDto.cuenta_id;
    let concepto = createDepositDto.concepto;
    delete createDepositDto.cuenta_id;
    delete createDepositDto.concepto;
    //guardar
    let result = await this.repository.save(createDepositDto);
    //registrar en libro diario
    await this.logBookService.registerDeposit({
      concepto,debe:0,haber:1,total:createDepositDto.monto,cuenta,fecha:new Date(),usuario:id_usuario
    },result);
    //sumar saldo de cuenta
    await this.addSaldo(createDepositDto.cuenta,createDepositDto.monto);
    return result;
  }

  /**
   * Obtener todos los depósitos
   */
  async findAll() {
    let result = await this.repository.createQueryBuilder('dep')
    .innerJoinAndSelect('dep.cuenta','cuenta')
    .innerJoinAndSelect('dep.usuario','usuario')
    .innerJoinAndSelect('dep.tipo','tipo')
    .orderBy('dep.id')
    .getMany();
    result.forEach(element => {
        element['no_cuenta'] = element.cuenta?element.cuenta.no_cuenta:'';
        element['id_cuenta'] = element.cuenta?element.cuenta.id:'';
        element['usuario_responsable'] = element.usuario?element.usuario.nombre+' '+element.usuario.apellido:'';
        element['tipo_deposito'] = element.tipo?element.tipo.nombre:'';
      delete element.tipo;
      delete element.usuario;
      delete element.cuenta; 
    });
    return result;
  }

  /**
   * Depósitos registrados de una cuenta bancaria
   * @param id_account
   */
  async findAllByAccount(id_account:number) {
    let result = await this.repository.createQueryBuilder('dep')
    .innerJoinAndSelect('dep.cuenta','cuenta')
    .innerJoinAndSelect('dep.usuario','usuario')
    .innerJoinAndSelect('dep.tipo','tipo')
    .where('cuenta.id = :id_account',{id_account})
    .orderBy('dep.id')
    .getMany();
    result.forEach(element => {
        element['no_cuenta'] = element.cuenta?element.cuenta.no_cuenta:'';
        element['cuentahabiente'] = element.cuenta?element.cuenta.cuentahabiente:'';
        element['usuario_responsable'] = element.usuario?element.usuario.nombre+' '+element.usuario.apellido:'';
        element['tipo_deposito'] = element.tipo?element.tipo.nombre:'';
      delete element.tipo;
      delete element.usuario;
      delete element.cuenta; 
    });
    return result;
  }

  /**
   * Obtener el total de depositos en una cuenta
   * @param id de cuenta
   */
  async getTotal(id:number){
    const deposits = await this.findAllByAccount(id);
    var total = 0;
    deposits.forEach(element => {
      total += element.monto;
    });
    return total;
  }

  /**
   * Aumentar saldo de cuenta
   * @param id
   * @param cant
   */
  private async addSaldo(id:number,cant:number){
    let cuenta = await this.repositoryAccountb.findOne(id);
    if(cuenta){
      await this.repositoryAccountb.update(id,{
        saldo:parseFloat(cuenta.saldo.toString())+parseFloat(cant.toString())
      })
    }
  }
}
