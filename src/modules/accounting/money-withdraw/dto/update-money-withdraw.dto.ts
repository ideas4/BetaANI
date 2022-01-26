import { PartialType } from '@nestjs/mapped-types';
import { CreateMoneyWithdrawDto } from './create-money-withdraw.dto';

export class UpdateMoneyWithdrawDto extends PartialType(CreateMoneyWithdrawDto) {}
