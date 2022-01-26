import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { LogInventory } from '../inventory/entities/log-inventory.entity';
import { ImageProduct } from './entities/img-product.entity';
import { InventoryService } from '../inventory/services/inventory/inventory.service';
import { LogInventoryService } from '../inventory/services/log-inventory/log-inventory.service';
import { InventoryController } from '../inventory/inventory.controller';
import { ProductsService } from './products.service';
import { Category } from './categories/entities/category.entity';
import { CategoriesService } from './categories/categories.service';
import { Color } from './colors/entities/color.entity';
import { SpecProduct } from './specs/entities/spec-product.entity';
import { Spec } from './specs/entities/spec.entity';
import { SpecsService } from './specs/specs.service';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { ConfigService } from '../configurations/config-admin/config.service';
import { Config } from '../configurations/config-admin/entities/config.entity';
import { ConfigEcommerce } from '../configurations/config-ecommerce/entities/config-ecommerce.entity';
import { RelationProducts } from './entities/relation-products.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Product,Inventory,LogInventory,ImageProduct,
    Category,Color,SpecProduct,Spec,Config,ConfigEcommerce,
    RelationProducts
  ])],
  controllers: [ProductsController, InventoryController],
  providers: [ProductsService, InventoryService, LogInventoryService,CategoriesService,SpecsService,ConfigService,PdfGeneratorService]
})
export class ProductsModule {}
