import { PartialType } from '@nestjs/mapped-types';
import { CreateLedgerAccountsDto } from './create-ledger-accounts.dto';

export class UpdateLedgerAccountsDto extends PartialType(
  CreateLedgerAccountsDto,
) {}
