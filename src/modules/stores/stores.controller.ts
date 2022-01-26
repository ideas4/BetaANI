import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('stores')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear una sucursal' })
  @ApiOkResponse({ status: 200, description: 'Sucursal Ok' })
  @ApiNotAcceptableResponse({ description: 'La sucursal ya existe' })
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de sucursales' })
  @ApiOkResponse({ status: 200, description: 'Sucursales Ok' })
  findAll() {
    return this.storesService.findAll();
  }

  @Get('fill')
  @ApiOperation({
    summary: 'Permite obtener una lista con nombre y clave de las sucursales',
  })
  @ApiOkResponse({ status: 200, description: 'Sucursal Ok' })
  fill() {
    return this.storesService.findtoFill();
  }

  @Get('fillUser/:id/:sucursal')
  @ApiOperation({
    summary: 'Permite obtener las sucursales dependiendo el rol del usuario.',
  })
  @ApiOkResponse({ status: 200, description: 'Sucursal Ok' })
  fillUser(@Param('id') id: string, @Param('sucursal') sucursal: string) {
    return this.storesService.findStoreforUser(id, sucursal);
  }

  @Get('fill/:id')
  @ApiOperation({
    summary:
      'Permite obtener una lista con nombre y clave de las sucursales en las cuales hay existencia de un producto',
  })
  @ApiOkResponse({ status: 200, description: 'Sucursal Ok' })
  fillByProd(@Param('id') id: string) {
    return this.storesService.findtoFillProd(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Permite obtener la información de una sucursal para editar',
  })
  @ApiOkResponse({ status: 200, description: 'Sucursal Ok' })
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite modificar una sucursal' })
  @ApiOkResponse({ status: 200, description: 'Sucursal Ok' })
  @ApiNotAcceptableResponse({ description: 'La sucursal ya existe' })
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar una sucursal' })
  @ApiOkResponse({ status: 200, description: 'Sucursal Ok' })
  remove(@Param('id') id: string) {
    return this.storesService.remove(+id);
  }
}
