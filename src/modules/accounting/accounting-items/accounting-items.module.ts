import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingItemsController } from './accounting-items.controller';
import { AccountingItemsService } from './accounting-items.service';
import { AccountingItems } from './entities/accounting-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountingItems])],
  controllers: [AccountingItemsController],
  providers: [AccountingItemsService],
})
export class AccountingItemsModule {}
