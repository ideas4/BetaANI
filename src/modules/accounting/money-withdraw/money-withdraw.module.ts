import { Module } from '@nestjs/common';
import { MoneyWithdrawService } from './money-withdraw.service';
import { MoneyWithdrawController } from './money-withdraw.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyWithdrawType } from './entities/withdraw-type.entity';
import { MoneyWithdraw } from './entities/money-withdraw.entity';
import { LogBookService } from '../log-book/log-book.service';
import { LogBook } from '../log-book/entities/log-book.entity';
import { BankAccount } from '../bank-accounts/entities/bank-account.entity';
import { BankAccountType } from '../bank-accounts/entities/bank-account-type.entity';

@Module({
  imports:[TypeOrmModule.forFeature([MoneyWithdrawType,MoneyWithdraw,LogBook,BankAccount, BankAccountType])],
  controllers: [MoneyWithdrawController],
  providers: [MoneyWithdrawService,LogBookService]
})
export class MoneyWithdrawModule {}
