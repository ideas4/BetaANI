import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountingItemsDto } from './dto/create-accounting-items.dto';
import { UpdateAccountingItemsDto } from './dto/update-accounting-items-dto';
import { AccountingItems } from './entities/accounting-items.entity';

@Injectable()
export class AccountingItemsService {
  constructor(
    @InjectRepository(AccountingItems)
    private repository: Repository<AccountingItems>,
  ) {}

  async create(createAccountingItems: CreateAccountingItemsDto) {
    if (
      !(await this.repository.findOne({ codigo: createAccountingItems.codigo }))
    ) {
      return this.repository.save(createAccountingItems);
    } else {
      throw new HttpException(
        'El codigo de la partida ya existe.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async findAll() {
    const result = await this.repository.query(`select partida.codigo, 
              partida.nombre, 
              partida.descripcion, 
              tc.nombre as nombre_partida from partida
    inner join tipo_cuenta tc on partida.tipo_partida = tc.id`);
    return result;
  }

  findOne(codigo: string) {
    return this.repository.findOne({ codigo: codigo });
  }

  async update(
    codigo: string,
    updateAccountingItemsDto: UpdateAccountingItemsDto,
  ) {
    const inst = await this.repository.findOne({
      codigo: updateAccountingItemsDto.codigo,
    });
    if (!inst || inst.codigo == codigo) {
      return (await this.repository.update(codigo, updateAccountingItemsDto))
        .affected;
    } else {
      throw new HttpException(
        'La partida ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async remove(codigo: string) {
    try {
      return (await this.repository.delete(codigo)).affected;
    } catch (e) {
      throw new HttpException(
        'La partida no se eliminó correctamente',
        HttpStatus.CONFLICT,
      );
    }
  }
}
