import { Module } from '@nestjs/common';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { DetailBillModule } from './detail-bill/detail-bill.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bill]), DetailBillModule],
  controllers: [BillController],
  providers: [BillService]
})
export class BillModule {}
