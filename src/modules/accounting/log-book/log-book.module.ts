import { Module } from '@nestjs/common';
import { LogBookService } from './log-book.service';
import { LogBookController } from './log-book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from '../deposits/entities/deposit.entity';
import { Check } from '../checks/entities/check.entity';
import { Account } from '../accounts/entities/account.entity';
import { LogBook } from './entities/log-book.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Deposit,Check,Account,LogBook])],
  controllers: [LogBookController],
  providers: [LogBookService]
})
export class LogBookModule {}
