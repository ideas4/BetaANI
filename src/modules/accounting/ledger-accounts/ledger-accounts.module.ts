import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LedgerAccounts } from './entities/ledger-accounts.entity';
import { LedgerAccountsController } from './ledger-accounts.controller';
import { LedgerAccountsService } from './ledger-accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerAccounts])],
  controllers: [LedgerAccountsController],
  providers: [LedgerAccountsService],
})
export class LedgerAccountsModule {}
