import { Module } from '@nestjs/common';
import { CategoriesModule } from '../products/categories/categories.module';
import { BrandsModule } from '../products/brands/brands.module';
import { ColorsModule } from '../products/colors/colors.module';
import { ProductsModule } from '../products/products.module';
import { SpecsModule } from '../products/specs/specs.module';

@Module({
  imports: [CategoriesModule, BrandsModule, ColorsModule, ProductsModule, SpecsModule],
  providers:[]
})
export class InventoryModule {}
