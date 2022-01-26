import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { InventoryService } from '../inventory/services/inventory/inventory.service';
import { Inventory } from '../inventory/entities/inventory.entity';
import { LogInventory } from '../inventory/entities/log-inventory.entity';
import { LogInventoryService } from '../inventory/services/log-inventory/log-inventory.service';
import { ConfigService } from '../configurations/config-admin/config.service';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { Config } from '../configurations/config-admin/entities/config.entity';
import { ConfigEcommerce } from '../configurations/config-ecommerce/entities/config-ecommerce.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Store,Inventory,LogInventory,Config, ConfigEcommerce])],
  controllers: [StoresController],
  providers: [StoresService,InventoryService,LogInventoryService,ConfigService,PdfGeneratorService]
})
export class StoresModule {}
