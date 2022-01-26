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
import { ClientPriceSheetService } from './client-price-sheet.service';
import { CreateClientPriceSheetDto } from './dto/create-client-priceSheet.dto';
import { UpdateClientPriceSheetDto } from './dto/update-client-priceSheet.dto';

@Controller('client-price-sheet')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Client Price Sheet')
export class ClientPriceSheetController {
  constructor(private readonly: ClientPriceSheetService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear una relacion cliente-hojaprecio' })
  @ApiOkResponse({ status: 200, description: 'Cliente Hoja Precios OK' })
  @ApiNotAcceptableResponse({
    description: 'La relacion cliente-hojaPrecio ya existe.',
  })
  createBill(@Body() createClientPriceSheetDto: CreateClientPriceSheetDto) {
    return this.readonly.create(createClientPriceSheetDto);
  }

  @Put(':hojaId/:clienteId')
  @ApiOperation({
    summary:
      'Permite obtener la información del una relacion cliente-hojaprecio para editar',
  })
  @ApiOkResponse({ status: 200, description: 'Cliente Hoja de precios Ok' })
  update(
    @Param('hojaId') id: number,
    @Param('clienteId') clienteId: number,
    @Body() updateClientPriceSheetDto: UpdateClientPriceSheetDto,
  ) {
    return this.readonly.update(id, clienteId, updateClientPriceSheetDto);
  }

  @Get('client/:hojaId')
  @ApiOperation({
    summary:
      'Permite obtener la información del una relacion cliente-hojaprecio por medio del id de la hoja de precios.',
  })
  @ApiOkResponse({ status: 200, description: 'cliente Hoja de precios Ok' })
  findAllSheet(@Param('hojaId') id: number) {
    //console.log('desde findAllSheet');
    return this.readonly.findAllSheet(id);
  }

  @Get('clientDate/:clientId')
  @ApiOperation({
    summary:
      'Permite obtener la información del una hoja de precios en una fecha actual por medio del id del cliente.',
  })
  @ApiOkResponse({ status: 200, description: 'cliente Hoja de precios Ok' })
  findSheetClient(@Param('clientId') id: number) {
    return this.readonly.findSheetClient(id);
  }

  @Get(':hojaId/:clienteId')
  @ApiOperation({
    summary:
      'Permite obtener la información del una relacion cliente-hojaprecio',
  })
  @ApiOkResponse({ status: 200, description: 'cliente Hoja de precios Ok' })
  findOne(@Param('hojaId') id: number, @Param('clienteId') clienteId: number) {
    return this.readonly.findOne(id, clienteId);
  }

  @Get(':clienteId')
  @ApiOperation({
    summary:
      'Permite obtener la información del una relacion cliente-hojaprecio',
  })
  @ApiOkResponse({ status: 200, description: 'cliente Hoja de precios Ok' })
  findOneClient(@Param('clienteId') id: number) {
    //console.log('desde findOne');
    return this.readonly.findClient(id);
  }

  @Get()
  @ApiOperation({
    summary:
      'Permite obtener una lista de las relaciones de cliente-hojaprecio',
  })
  @ApiOkResponse({ status: 200, description: 'Cliente Hoja de precios Ok' })
  findAll() {
    return this.readonly.findAll();
  }

  @Delete(':idHoja/:idCliente')
  @ApiOperation({
    summary: 'Permite eliminar un cliente de la hoja de precios.',
  })
  @ApiOkResponse({ status: 200, description: 'Cliente Hoja de precios Ok' })
  remove(
    @Param('idHoja') idHoja: number,
    @Param('idCliente') idCliente: number,
  ) {
    return this.readonly.remove(idHoja, idCliente);
  }
}
