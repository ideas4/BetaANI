import { Module } from '@nestjs/common';
import { SpecsService } from './specs.service';
import { SpecsController } from './specs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spec } from './entities/spec.entity';
import { SpecProduct } from './entities/spec-product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Spec,SpecProduct])],
  controllers: [SpecsController],
  providers: [SpecsService]
})
export class SpecsModule {}
