import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailPriceSheetDto } from './create-detail-price-sheet.dto';

export class UpdateDetailPriceSheet extends PartialType(CreateDetailPriceSheetDto) {}
