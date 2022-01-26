import { PartialType } from '@nestjs/mapped-types';
import { CreateFeatCategoryDto } from './create-feat-category.dto';
export class UpdateFeatCategoryDto extends PartialType(CreateFeatCategoryDto) {}
