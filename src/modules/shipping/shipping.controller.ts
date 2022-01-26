import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Brand } from '../products/brands/entities/brand.entity';

@Controller('shipping')
@ApiTags('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crea un costo de envio ' })
  @ApiOkResponse({status: 200,description: 'Envio Ok',type: Brand})
  @ApiForbiddenResponse({description:'No está autorizado'})
  @ApiBadRequestResponse({description:'El costo de envío ya existe'})
  create(@Body() createShippingDto: CreateShippingDto) {
    return this.shippingService.create(createShippingDto);
  }

  @Get()
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtener una lista de costos de envio ' })
  @ApiOkResponse({status: 200,description: 'Envio Ok',type: Brand})
  findAll() {
    return this.shippingService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener un costo de envio ' })
  @ApiOkResponse({status: 200,description: 'Envio Ok',type: Brand})
  @ApiForbiddenResponse({description:'No está autorizado'})
  findOne(@Param('id') id: string) {
    return this.shippingService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Actualizar un costo de envio ' })
  @ApiOkResponse({status: 200,description: 'Envio Ok',type: Brand})
  @ApiForbiddenResponse({description:'No está autorizado'})
  @ApiBadRequestResponse({description:'El costo de envío ya existe'})
  update(@Param('id') id: string, @Body() updateShippingDto: UpdateShippingDto) {
    return this.shippingService.update(+id, updateShippingDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Elimina un costo de envio ' })
  @ApiOkResponse({status: 200,description: 'Envio Ok',type: Brand})
  @ApiForbiddenResponse({description:'No está autorizado'})
  remove(@Param('id') id: string) {
    return this.shippingService.remove(+id);
  }
}
