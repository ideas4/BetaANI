import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformArrayToString, transforPropToString } from 'src/constants';
import { Repository } from 'typeorm';
import { DepositsService } from '../deposits/services/deposits/deposits.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountType } from './entities/bank-account-type.entity';
import { BankAccount } from './entities/bank-account.entity';
import { MoneyWithdrawService } from '../money-withdraw/money-withdraw.service';
import { ChecksService } from '../checks/checks.service';

@Injectable()
export class BankAccountsService {

  constructor(@InjectRepository(BankAccount) private repository:Repository<BankAccount>,
  @InjectRepository(BankAccountType) private repositoryType:Repository<BankAccountType>,
  private depositsService:DepositsService, private withdrawalService:MoneyWithdrawService,
              private checksService:ChecksService){}

  async create(createBankAccountDto: CreateBankAccountDto) {
    if(!await this.repository.findOne({no_cuenta:createBankAccountDto.no_cuenta})){
      return this.repository.save(createBankAccountDto);
   }else{
     throw new HttpException('El número de cuenta ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

 
  async findAll() {
    let result:any[] = await this.repository.createQueryBuilder('ba')
    .leftJoinAndSelect('ba.banco','banco')
    .leftJoinAndSelect('ba.tipo_cuenta','tipo_cuenta')
    .orderBy('ba.id')
    .getMany();
    transforPropToString(result,'banco',['nombre']);
    transforPropToString(result,'tipo_cuenta',['nombre'])
    return result;
  }

  async findOne(id: number) {
    let result = await this.repository.createQueryBuilder('ba')
    .leftJoinAndSelect('ba.banco','banco')
    .leftJoinAndSelect('ba.tipo_cuenta','tipo_cuenta')
    .where('ba.id = :idb',{idb:id})
    .getOne(); 
    transforPropToString(result,'banco',['id']);
    transforPropToString(result,'tipo_cuenta',['id'])
    return result;
  }

  async getDetail(id:number){
    let result = await this.repository.createQueryBuilder('ba')
    .leftJoinAndSelect('ba.banco','banco')
    .leftJoinAndSelect('ba.tipo_cuenta','tipo_cuenta')
    .where('ba.id = :idb',{idb:id})
    .getOne(); 
    transforPropToString(result,'banco',['nombre']);
    transforPropToString(result,'tipo_cuenta',['nombre'])
    const deposits:any[] = await this.depositsService.findAllByAccount(id);
    const withdrawals:any[] = await this.withdrawalService.findAllByAccount(id);
    const checks:any[] = await this.checksService.findAllByAccount(id);
    return {
      detail:result,
      depositos:deposits,
      retiros:withdrawals,
      cheques:checks
    };
  }

  async update(id: number, updateBankAccountDto: UpdateBankAccountDto) {
    const inst = await this.repository.findOne({no_cuenta:updateBankAccountDto.no_cuenta});
    if(!inst || inst.id == id){
      return (await this.repository.update(id,updateBankAccountDto)).affected;
    }else{
     throw new HttpException('El número de cuenta ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  async remove(id: number) {
    return (await this.repository.delete(id)).affected;
  }

  findType(){
    return this.repositoryType.find();
  }

  fill(){
    return this.repository.createQueryBuilder('ba')
    .select(['ba.no_cuenta','ba.nombre','ba.id'])
    .getMany();
  }

  /**
   * Aumentar saldo de cuenta
   * @param id
   * @param cant
   */
  async addSaldo(id:number,cant:number){
    let cuenta = await this.repository.findOne(id);
    if(cuenta){
      await this.repository.update(id,{
        saldo:cuenta.saldo+cant
      })
    }
  }

  /**
   * Restar saldo de cuenta
   * @param id
   * @param cant
   */
  async delSaldo(id:number,cant:number){
    let cuenta = await this.repository.findOne(id);
    if(cuenta){
      await this.repository.update(id,{
        saldo:cuenta.saldo-cant
      })
    }
  }
}
