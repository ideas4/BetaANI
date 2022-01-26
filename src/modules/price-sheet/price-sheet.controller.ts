import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePriceSheetDto } from './dto/create-price-sheet.dto';
import { UpdatePriceSheetDto } from './dto/update-price-sheet.dto';
import { PriceSheetService } from './price-sheet.service';

@Controller('price-sheet')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Price Sheet')
export class PriceSheetController {
  constructor(private readonly: PriceSheetService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear una hoja de precios' })
  @ApiOkResponse({ status: 200, description: 'Hoja Precios OK' })
  @ApiNotAcceptableResponse({
    description: 'Hoja de precios/Producto, ya existe',
  })
  createBill(@Body() createPriceSheetDto: CreatePriceSheetDto) {
    return this.readonly.create(createPriceSheetDto);
  }

  @Get('products/:id/:idSucursal')
  @ApiOperation({
    summary:
      'Permite obtener una lista de productos que pertenece a esa hoja de precios.',
  })
  @ApiOkResponse({ status: 200, description: 'Hoja de precios Ok' })
  findAllProductos(
    @Param('id') id: number,
    @Param('idSucursal') idSucursal: number,
  ) {
    return this.readonly.findAllProducts(id, idSucursal);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de hoja de precios' })
  @ApiOkResponse({ status: 200, description: 'Hoja de precios Ok' })
  findAll() {
    return this.readonly.findAll();
  }

  @Put(':id')
  @ApiOperation({
    summary:
      'Permite obtener la información del encabezado de una hoja de precios para editar',
  })
  @ApiOkResponse({ status: 200, description: 'Hoja de precios Ok' })
  update(
    @Param('id') id: number,
    @Body() updatePriceSheetDto: UpdatePriceSheetDto,
  ) {
    return this.readonly.update(id, updatePriceSheetDto);
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Permite obtener la información de un encabezado de una hoja de precios',
  })
  @ApiOkResponse({ status: 200, description: 'Hoja de precios Ok' })
  findOne(@Param('id') id: number) {
    return this.readonly.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Permite eliminar un encabezado de una hoja de precios por su id.',
  })
  @ApiOkResponse({ status: 200, description: 'Hoja de precios Ok' })
  remove(@Param('id') id: number) {
    return this.readonly.remove(id);
  }

  @Get('/client/:id')
  @ApiOperation({
    summary:
      'Permite obtener una lista de las todas las relaciones de cliente-hojaprecio',
  })
  @ApiOkResponse({ status: 200, description: 'Cliente Hoja de precios Ok' })
  findAllClientePriceSheet() {
    return this.readonly.findAllClient();
  }
}
