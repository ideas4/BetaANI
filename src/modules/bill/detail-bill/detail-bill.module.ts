import { Module } from '@nestjs/common';
import { DetailBillService } from './detail-bill.service';
import { DetailBillController } from './detail-bill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailBill } from './entities/detailBill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetailBill]), DetailBillModule],
  providers: [DetailBillService],
  controllers: [DetailBillController]
})
export class DetailBillModule {}
