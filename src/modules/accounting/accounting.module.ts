import { Module } from '@nestjs/common';
import { BanksModule } from './banks/banks.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { DepositsModule } from './deposits/deposits.module';
import { AccountingMovementsModule } from './accounting-movements/accounting-movements.module';
import { ChecksModule } from './checks/checks.module';
import { AccountsModule } from './accounts/accounts.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { LogBookModule } from './log-book/log-book.module';
import { MoneyWithdrawModule } from './money-withdraw/money-withdraw.module';
import { AccountingItemsModule } from './accounting-items/accounting-items.module';
import { LedgerAccountsModule } from './ledger-accounts/ledger-accounts.module';

@Module({
  imports: [BanksModule, BankAccountsModule, DepositsModule, AccountingMovementsModule, ChecksModule, AccountsModule, CreditCardsModule, LogBookModule, MoneyWithdrawModule, AccountingItemsModule, LedgerAccountsModule]
})
export class AccountingModule {}
