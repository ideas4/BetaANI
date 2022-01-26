import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsModule } from './coupons/coupons.module';
import { SaleEntity } from './entities/sale.entity';
import { Store } from '../stores/entities/store.entity';
import { CreditCard } from '../accounting/credit-cards/entities/credit-card.entity';
import { LogBookService } from '../accounting/log-book/log-book.service';
import { LogBook } from '../accounting/log-book/entities/log-book.entity';

@Module({
  imports:[TypeOrmModule.forFeature([SaleEntity,Store,CreditCard,LogBook]), CouponsModule],
  controllers: [SalesController],
  providers: [SalesService,LogBookService]
})
export class SalesModule {}
