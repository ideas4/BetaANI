import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoneyWithdraw } from './entities/money-withdraw.entity';
import { Repository } from 'typeorm';
import { MoneyWithdrawType } from './entities/withdraw-type.entity';
import { LogBookService } from '../log-book/log-book.service';
import { CreateMoneyWithdrawDto } from './dto/create-money-withdraw.dto';
import { UpdateMoneyWithdrawTypeDto } from './dto/update-money-withdraw-type.dto';
import { CreateMoneyWithdrawTypeDto } from './dto/create-money-withdraw-type.dto';
import { BankAccount } from '../bank-accounts/entities/bank-account.entity';

@Injectable()
export class MoneyWithdrawService {

  constructor(@InjectRepository(MoneyWithdraw) private repository:Repository<MoneyWithdraw>,
              @InjectRepository(MoneyWithdrawType) private repositoryType:Repository<MoneyWithdrawType>,
              @InjectRepository(BankAccount) private repositoryAccountb:Repository<BankAccount>,
              private logBookService:LogBookService) {
  }


  /**
   * Registrar retiro
   * @param create
   * @param id_usuario
   */
  async create(create: CreateMoneyWithdrawDto,id_usuario:string) {
    if(await this.repository.count({where:{no_boleta:create.no_boleta}}) > 0){
      throw new HttpException('El No. de boleta ya existe',HttpStatus.BAD_REQUEST)
    }
    create['fecha'] = new Date();
    create['usuario'] = id_usuario;
    //contabilidad
    let cuenta = create.cuenta_id;
    let concepto = create.concepto;
    delete create.cuenta_id;
    delete create.concepto;
    //guardar
    let result = await this.repository.save(create);
    //registrar en libro diario
    await this.logBookService.registerWithdrawal({
      concepto,debe:0,haber:1,total:create.monto,cuenta,fecha:new Date(),usuario:id_usuario
    },result);
    //restar saldo de cuenta
    await this.delSaldo(create.cuenta,create.monto);
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
   * Retiros registrados de una cuenta bancaria
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
   * Crear un tipo de deposito
   * @param createDepositTypeDto
   */
  async createType(createDepositTypeDto: CreateMoneyWithdrawTypeDto) {
    if(!await this.repositoryType.findOne({nombre:createDepositTypeDto.nombre})){
      return this.repositoryType.save(createDepositTypeDto);
    }else{
      throw new HttpException('El tipo de retiro existe',HttpStatus.NOT_ACCEPTABLE);
    }
  }

  /**
   * Obtener una lista de retiros
   */
  findAllType() {
    return this.repositoryType.find();
  }

  /**
   * Obtener un tipo de retiro
   * @param id
   */
  findOneType(id: number) {
    return this.repositoryType.findOne(id);
  }

  /**
   * Actualizar un tipo de retiro
   * @param id
   * @param updateMoneyWithdrawTypeDto
   */
  async updateType(id: number, updateMoneyWithdrawTypeDto: UpdateMoneyWithdrawTypeDto) {
    const inst = await this.repository.findOne({nombre:updateMoneyWithdrawTypeDto.nombre});
    if(!inst || inst.id == id){
      return (await this.repository.update(id,updateMoneyWithdrawTypeDto)).affected;
    }else{
      throw new HttpException('El tipo de retiro ya existe',HttpStatus.NOT_ACCEPTABLE);
    }
  }

  /**
   * Eliminar tipo de retiro
   * @param id
   */
  async removeType(id: number) {
    try {
      return (await this.repositoryType.delete(id)).affected;
    }catch (e) {
      throw  new HttpException('No se eliminó correctamente el tipo de retiro',HttpStatus.CONFLICT)
    }
  }

  /**
   * Obtener una lista de tipos de retiro
   */
  findtoFillType(){
    return this.repositoryType.find();
  }

  /**
   * Restar saldo de cuenta
   * @param id
   * @param cant
   */
  private async delSaldo(id:number,cant:number){
    let cuenta = await this.repositoryAccountb.findOne(id);
    if(cuenta){
      await this.repositoryAccountb.update(id,{
        saldo:parseFloat(cuenta.saldo.toString())-parseFloat(cant.toString())
      })
    }
  }
}
