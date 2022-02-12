import { PartialType } from '@nestjs/mapped-types';
import { ProductOrderDto } from './product-order.dto';

export class UpdateProductOrderDto extends PartialType(ProductOrderDto) {}
