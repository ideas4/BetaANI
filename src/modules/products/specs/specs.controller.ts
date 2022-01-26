import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { SpecsService } from './specs.service';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Spec } from './entities/spec.entity';

@Controller('specs')
@ApiTags('Specs')
export class SpecsController {
  constructor(private readonly specsService: SpecsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crea una especificación' })
  @ApiOkResponse({status: 200,description: 'Especificación Creada',type: Spec})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  @ApiNotAcceptableResponse({description:'La especificación ya existe'})
  create(@Body() createSpecDto: CreateSpecDto) {
    return this.specsService.create(createSpecDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtiene la lista de especcificaciones creadas' })
  @ApiOkResponse({status: 200,description: 'Especificaciones Ok'})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  findAll() {
    return this.specsService.findAll();
  }

  @Get('fill')
  @ApiOperation({ summary: 'Obtiene una lista de especificaciones' })
  @ApiOkResponse({status: 200,description: 'Especificaciones Ok'})
  fill() {
    return this.specsService.findtoFill();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtiene información de una especificación para editar' })
  @ApiOkResponse({status: 200,description: 'Especificación Ok',type: Spec})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  findOne(@Param('id') id: string) {
    return this.specsService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Modificar una especificación' })
  @ApiOkResponse({status: 200,description: 'Especcificación modificada',type: Spec})
  @ApiForbiddenResponse({description:'No está autorizado'})  
  @ApiNotAcceptableResponse({description:'La especificación ya existe'})
  update(@Param('id') id: string, @Body() updateSpecDto: UpdateSpecDto) {
    return this.specsService.update(+id, updateSpecDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Elimina una especificación' })
  @ApiOkResponse({status: 200,description: 'Especificación Ok',type: Spec})
  @ApiForbiddenResponse({description:'No está autorizado'}) 
  remove(@Param('id') id: string) {
    return this.specsService.remove(+id);
  }
}
