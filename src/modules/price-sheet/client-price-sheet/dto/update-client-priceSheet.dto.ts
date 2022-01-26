import { PartialType } from '@nestjs/mapped-types';
import { CreateClientPriceSheetDto } from './create-client-priceSheet.dto';

export class UpdateClientPriceSheetDto extends PartialType(CreateClientPriceSheetDto) {}
