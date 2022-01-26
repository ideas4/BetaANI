import { Module } from '@nestjs/common';
import { ConfigEcommerceService } from './config-ecommerce.service';
import { ConfigEcommerceController } from './config-ecommerce.controller';
import { FeaturedCategory } from './entities/featured-categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/modules/products/categories/entities/category.entity';
import { Store } from 'src/modules/stores/entities/store.entity';
import { ConfigEcommerce } from './entities/config-ecommerce.entity';
import { Config } from '../config-admin/entities/config.entity';
import { Product } from '../../products/entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([FeaturedCategory,Category,Store,ConfigEcommerce,Config,Product])],
  controllers: [ConfigEcommerceController],
  providers: [ConfigEcommerceService]
})
export class ConfigEcommerceModule {}
