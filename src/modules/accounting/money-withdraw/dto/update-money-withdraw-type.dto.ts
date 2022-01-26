import { PartialType } from '@nestjs/mapped-types';
import { CreateMoneyWithdrawTypeDto } from './create-money-withdraw-type.dto';

export class UpdateMoneyWithdrawTypeDto extends PartialType(CreateMoneyWithdrawTypeDto) {}
