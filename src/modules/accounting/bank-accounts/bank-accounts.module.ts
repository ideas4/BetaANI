import { Module } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountType } from './entities/bank-account-type.entity';
import { BankAccount } from './entities/bank-account.entity';
import { DepositsService } from '../deposits/services/deposits/deposits.service';
import { Deposit } from '../deposits/entities/deposit.entity';
import { LogBookService } from '../log-book/log-book.service';
import { LogBook } from '../log-book/entities/log-book.entity';
import { MoneyWithdrawService } from '../money-withdraw/money-withdraw.service';
import { MoneyWithdraw } from '../money-withdraw/entities/money-withdraw.entity';
import { MoneyWithdrawType } from '../money-withdraw/entities/withdraw-type.entity';
import { ChecksService } from '../checks/checks.service';
import { Check } from '../checks/entities/check.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BankAccountType,BankAccount,Deposit,LogBook,MoneyWithdraw,Check,MoneyWithdrawType])],
  controllers: [BankAccountsController],
  providers: [BankAccountsService,DepositsService,LogBookService,MoneyWithdrawService,ChecksService]
})
export class BankAccountsModule {}
