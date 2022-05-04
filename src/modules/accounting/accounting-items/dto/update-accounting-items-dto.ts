import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountingItemsDto } from './create-accounting-items.dto';

export class UpdateAccountingItemsDto extends PartialType(
  CreateAccountingItemsDto,
) {}
