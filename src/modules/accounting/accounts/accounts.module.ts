import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './services/account.service';
import { AccountTypeController } from './account-type.controller';
import { AccountTypeService } from './services/account-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountType } from './entities/account-type.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Account,AccountType])],
  controllers: [AccountController,AccountTypeController],
  providers: [AccountService,AccountTypeService]
})
export class AccountsModule {}
