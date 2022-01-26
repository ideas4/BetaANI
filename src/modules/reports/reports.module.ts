import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingMovement } from '../accounting/accounting-movements/entities/accounting-movement.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { LogInventory } from '../inventory/entities/log-inventory.entity';
import { InventoryService } from '../inventory/services/inventory/inventory.service';
import { LogInventoryService } from '../inventory/services/log-inventory/log-inventory.service';
import { Order } from '../orders/entities/order.entity';
import { Store } from '../stores/entities/store.entity';
import { StoresService } from '../stores/stores.service';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { ConfigService } from '../configurations/config-admin/config.service';
import { Config } from '../configurations/config-admin/entities/config.entity';
import { ConfigEcommerce } from '../configurations/config-ecommerce/entities/config-ecommerce.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AccountingMovement,Order,Store,Inventory,LogInventory,Config, ConfigEcommerce])],
  controllers: [ReportsController],
  providers: [ReportsService,StoresService,InventoryService,LogInventoryService,ConfigService,PdfGeneratorService]
})
export class ReportsModule {}
