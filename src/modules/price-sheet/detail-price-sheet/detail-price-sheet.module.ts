import { Module } from '@nestjs/common';
import { DetailPriceSheetService } from './detail-price-sheet.service';
import { DetailPriceSheetController } from './detail-price-sheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailPriceSheet } from './entities/detail-price-sheet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetailPriceSheet])],
  providers: [DetailPriceSheetService],
  controllers: [DetailPriceSheetController]
})
export class DetailPriceSheetModule {}
