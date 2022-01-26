import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountingMovementTypeDto } from './create-accounting-movement-type.dto';

export class UpdateAccountingMovementTypeDto extends PartialType(CreateAccountingMovementTypeDto) {}
