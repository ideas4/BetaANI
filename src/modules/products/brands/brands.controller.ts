import { Controller, Get, Post, Body, Put, Param, Delete, ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Brand } from './entities/brand.entity';

@Controller('brands')
@ApiTags('Brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crea una marca ' })
  @ApiOkResponse({status: 200,description: 'Marca Creada',type: Brand})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  @ApiNotAcceptableResponse({description:'La marca ya existe'})
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retorna una lista de marcas ' })
  @ApiOkResponse({status: 200,description: 'Lista de marcas'})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  findAll() {
    return this.brandsService.findAll();
  }

  @Get('fill')
  @ApiOperation({ summary: 'Retorna una lista de marcas' })
  @ApiOkResponse({status: 200,description: 'Lista de marcas'}) 
  fill() {
    return this.brandsService.findtoFill();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retorna información de una marca' })
  @ApiOkResponse({status: 200,description: 'Marca Ok'})
  @ApiForbiddenResponse({description:'No está autorizado'}) 
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Modifica la información de una marca' })
  @ApiOkResponse({status: 200,description: 'Marca Modificada',type: Brand})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  @ApiNotAcceptableResponse({description:'La marca ya existe'})
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Elimina una marca' })
  @ApiOkResponse({status: 200,description: 'Marca Eliminada',type: Brand})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }

}
