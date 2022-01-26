import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Category } from './entities/category.entity';


@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crea una categoría' })
  @ApiOkResponse({status: 200,description: 'Categoría Creada',type: Category})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  @ApiNotAcceptableResponse({description:'La categoría ya existe'})
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtiene una lista de categorias' })
  @ApiOkResponse({status: 200,description: 'Categoría Ok'})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('fill')
  @ApiOperation({ summary: 'Obtiene una lista de categorias' })
  @ApiOkResponse({status: 200,description: 'Categorías Ok'})
  fill() {
    return this.categoriesService.findtoFill();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtiene información de una categoía' })
  @ApiOkResponse({status: 200,description: 'Categoría Ok',type: Category})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Modificar una categoría' })
  @ApiOkResponse({status: 200,description: 'Categoría Ok',type: Category})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  @ApiNotAcceptableResponse({description:'La categoría ya existe'})
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Elimina una categoría' })
  @ApiOkResponse({status: 200,description: 'Categoría Ok',type: Category})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
