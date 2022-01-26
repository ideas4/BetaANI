import { Module } from '@nestjs/common';
import { DepositsService } from './services/deposits/deposits.service';
import { DepositsController } from './controllers/deposits/deposits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from './entities/deposit.entity';
import { DepositTypeService } from './services/deposit-type/deposit-type.service';
import { DepositTypeController } from './controllers/deposit-type/deposit-type.controller';
import { DepositType } from './entities/deposit-type.entity';
import { LogBook } from '../log-book/entities/log-book.entity';
import { LogBookService } from '../log-book/log-book.service';
import { BankAccountType } from '../bank-accounts/entities/bank-account-type.entity';
import { BankAccount } from '../bank-accounts/entities/bank-account.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Deposit,DepositType,LogBook,BankAccountType,BankAccount])],
  controllers: [DepositsController, DepositTypeController],
  providers: [DepositsService, DepositTypeService,LogBookService]
})
export class DepositsModule {}
