import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';


@Controller('colors')
@ApiTags('Colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  /**
   * Crear un nuevo color
   * @param createColorDto 
   */
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crea un color' })
  @ApiOkResponse({status: 200,description: 'Color Creado'})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  @ApiNotAcceptableResponse({description:'El color ya existe'})
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  /**
   * Obtener una lista de colores
   */
  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener una lista de colores' })
  @ApiOkResponse({status: 200,description: 'Color Ok'})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  findAll() {
    return this.colorsService.findAll();
  }

  /**
   * Obtener una lista de colores para llenar selects y combobox
   */
  @Get('fill')
  @ApiOperation({ summary: 'Obtener una lista de colores' })
  @ApiOkResponse({status: 200,description: 'Colores Ok'})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  fill() {
    return this.colorsService.findtoFill();
  }

  /**
   * Obtener la información de un color para editar
   * @param id 
   */
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener la información de un color' })
  @ApiOkResponse({status: 200,description: 'Color Ok'})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  findOne(@Param('id') id: string) {
    return this.colorsService.findOne(+id);
  }

  /**
   * Modificar un color 
   * @param id 
   * @param updateColorDto 
   */
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Modificar un color' })
  @ApiOkResponse({status: 200,description: 'Color Modificado'})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  @ApiNotAcceptableResponse({description:'El color no existe'})
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorsService.update(+id, updateColorDto);
  }

  /**
   * Eliminar un color 
   * @param id 
   */
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Eliminar un color' })
  @ApiOkResponse({status: 200,description: 'Color Eliminado'})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  remove(@Param('id') id: string) {
    return this.colorsService.remove(+id);
  }
}
