import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLedgerAccountsDto } from './dto/create-ledger-accounts.dto';
import { UpdateLedgerAccountsDto } from './dto/update-ledger-accounts.dto';
import { LedgerAccounts } from './entities/ledger-accounts.entity';

@Injectable()
export class LedgerAccountsService {
  constructor(
    @InjectRepository(LedgerAccounts)
    private repository: Repository<LedgerAccounts>,
  ) {}

  async create(createLedgerAccount: CreateLedgerAccountsDto) {
    return this.repository.save(createLedgerAccount);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  //pendiente, cuenta y valor para ser tomado en cuenta
  async update(id: number, updateBankDto: UpdateLedgerAccountsDto) {
    const inst = await this.repository.findOne({
      nombre_cuenta: updateBankDto.nombre_cuenta,
    });
    if (!inst || inst.id == id) {
      return (await this.repository.update(id, updateBankDto)).affected;
    } else {
      throw new HttpException(
        'La cuenta contable no existe.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async remove(id: number) {
    try {
      return (await this.repository.delete(id)).affected;
    } catch (e) {
      throw new HttpException(
        'La cuenta contable no se eliminó correctamente.',
        HttpStatus.CONFLICT,
      );
    }
  }
}
