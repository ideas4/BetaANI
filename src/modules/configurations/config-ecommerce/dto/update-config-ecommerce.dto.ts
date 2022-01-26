import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigEcommerceDto } from './create-config-ecommerce.dto';

export class UpdateConfigEcommerceDto extends PartialType(CreateConfigEcommerceDto) {}
