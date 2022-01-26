import { PartialType } from '@nestjs/mapped-types';
import { CreateDepositTypeDto } from "./create-deposit-type.dto";

export class UpdateDepositTypeDto extends PartialType(CreateDepositTypeDto) {}
