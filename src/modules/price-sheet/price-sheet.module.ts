import { Module } from '@nestjs/common';
import { PriceSheetService } from './price-sheet.service';
import { PriceSheetController } from './price-sheet.controller';
import { DetailPriceSheetModule } from './detail-price-sheet/detail-price-sheet.module';
import { ClientPriceSheetModule } from './client-price-sheet/client-price-sheet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceSheet } from './entities/price-sheet.entity';

@Module({
  providers: [PriceSheetService],
  controllers: [PriceSheetController],
  imports: [TypeOrmModule.forFeature([PriceSheet]), DetailPriceSheetModule, ClientPriceSheetModule]
})
export class PriceSheetModule {}
