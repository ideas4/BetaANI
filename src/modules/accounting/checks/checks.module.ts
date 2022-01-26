import { Module } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { ChecksController } from './checks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Check } from './entities/check.entity';
import { LogBookService } from '../log-book/log-book.service';
import { LogBook } from '../log-book/entities/log-book.entity';
import { BankAccount } from '../bank-accounts/entities/bank-account.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Check,LogBook,BankAccount])],
  controllers: [ChecksController],
  providers: [ChecksService,LogBookService]
})
export class ChecksModule {}
