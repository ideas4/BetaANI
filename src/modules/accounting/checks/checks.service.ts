import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Check } from './entities/check.entity';
import { LogBookService } from '../log-book/log-book.service';
import { BankAccount } from '../bank-accounts/entities/bank-account.entity';

@Injectable()
export class ChecksService {

  constructor(@InjectRepository(Check) private repository:Repository<Check>,
              @InjectRepository(BankAccount) private repositoryAccountb:Repository<BankAccount>,
              private logBookService:LogBookService) {
  }

  /**
   * Registrar un nuevo cheque
   * @param createCheckDto
   * @param id_usuario
   */
  async create(createCheckDto: CreateCheckDto,id_usuario:string) {
    if(await this.repository.count({where:{
      no_cheque:createCheckDto.no_cheque
      }}) > 0){
      throw new HttpException('El No. de cheque ya fue registrado', HttpStatus.BAD_REQUEST)
    }
    //contabilidad
    let cuenta = createCheckDto.cuenta_id;
    let concepto = createCheckDto.concepto;
    delete createCheckDto.cuenta_id;
    //guardar
    let result = await this.repository.save(createCheckDto);
    //registrar en libro diario
    await this.logBookService.registerCheck({
      concepto,debe:1,haber:0,total:createCheckDto.monto,cuenta,fecha:new Date(),usuario:id_usuario
    },result);
    //restar saldo de cuenta
    await this.delSaldo(createCheckDto.cuenta_bancaria,createCheckDto.monto);
    return result;
  }


  /**
   * Listar todos los cheques
   */
  findAll() {
    return this.repository.find();
  }

  /**
   * Mostrar la info de un solo cheque
   * @param id
   */
  async findOne(id: number) {
    let result:any = await this.repository.findOne(id,{relations:['cuenta_bancaria','cuenta']});
    result.cuenta_bancaria = result.cuenta_bancaria?result.cuenta_bancaria.id:1;
    result.cuenta = result.cuenta?result.cuenta.id:1
    return result;
  }

  /**
   * Actualizar cheque
   * @param id
   * @param updateCheckDto
   */
  async update(id: number, updateCheckDto: UpdateCheckDto) {
    return (await this.repository.update(id,updateCheckDto)).affected;
  }

  /**
   * Eliminar cheque
   * @param id
   */
  remove(id: number) {
    try {
      return this.repository.delete(id)
    }catch (e) {
      throw  new HttpException('No se pudo eliminar el cheque',HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * Retiros registrados de una cuenta bancaria
   * @param id_account
   */
  async findAllByAccount(id_account:number) {
    let result = await this.repository.createQueryBuilder('dep')
      .innerJoinAndSelect('dep.cuenta_bancaria','cuenta')
      .where('cuenta.id = :id_account',{id_account})
      .orderBy('dep.id')
      .getMany();
    return result;
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
