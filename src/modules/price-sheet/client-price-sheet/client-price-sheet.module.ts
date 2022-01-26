import { Module } from '@nestjs/common';
import { ClientPriceSheetService } from './client-price-sheet.service';
import { ClientPriceSheetController } from './client-price-sheet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientPriceSheet } from './entities/client-priceSheet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientPriceSheet])],
  providers: [ClientPriceSheetService],
  controllers: [ClientPriceSheetController]
})
export class ClientPriceSheetModule {}
