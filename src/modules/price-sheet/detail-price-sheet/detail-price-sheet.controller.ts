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
import { DetailPriceSheetService } from './detail-price-sheet.service';
import { UpdateDetailPriceSheet } from './dto/update-detail-price-sheet.dto';
import { DetailPriceSheet } from './entities/detail-price-sheet.entity';

@Controller('detail-price-sheet')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Price Sheet')
export class DetailPriceSheetController {
  constructor(private readonly: DetailPriceSheetService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear el detalle de una hoja de precios.' })
  @ApiOkResponse({ status: 200, description: 'Detalle de Hoja Precios OK' })
  @ApiNotAcceptableResponse({
    description: 'El detalle ingresado ya existe en la hoja de precios',
  })
  createBill(@Body() detailCreatePriceSheetDto: DetailPriceSheet) {
    return this.readonly.create(detailCreatePriceSheetDto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Permite obtener la lista del detalle de todas las hojas de precio',
  })
  @ApiOkResponse({ status: 200, description: 'Detalle de Hoja de precios Ok' })
  findAll() {
    return this.readonly.findAll();
  }

  @Put(':hojaId/:articuloId')
  @ApiOperation({
    summary:
      'Permite obtener la información de un detalle de una hoja de precios para editar',
  })
  @ApiOkResponse({ status: 200, description: 'Detalle de Hoja de precios Ok' })
  update(
    @Param('hojaId') hojaprecio_id: number,
    @Param('articuloId') articulo_id: number,
    @Body() updateDetailPriceSheetDto: UpdateDetailPriceSheet,
  ) {
    return this.readonly.update(
      hojaprecio_id,
      articulo_id,
      updateDetailPriceSheetDto,
    );
  }

  @Get(':hojaId/:articuloId')
  @ApiOperation({
    summary:
      'Permite obtener la información de un detalle de una hoja de precios con el ID de la hoja y ID articulo',
  })
  @ApiOkResponse({ status: 200, description: 'Hoja de precios Ok' })
  findOne(
    @Param('hojaId') hojaprecio_id: number,
    @Param('articuloId') articulo_id: number,
  ) {
    return this.readonly.findOne(hojaprecio_id, articulo_id);
  }

  @Get(':hojaId/')
  @ApiOperation({
    summary:
      'Permite obtener la información de un detalle de una hoja de precios de todos los articulos por ID de la hoja',
  })
  @ApiOkResponse({ status: 200, description: 'Hoja de precios Ok' })
  findOneSheet(@Param('hojaId') hojaprecio_id: number) {
    return this.readonly.findOneSheet(hojaprecio_id);
  }

  @Delete(':hojaId/:articuloId')
  @ApiOperation({
    summary:
      'Permite eliminar un articulo de una hoja de precios por su id y su articulo.',
  })
  @ApiOkResponse({ status: 200, description: 'Hoja de precios Ok' })
  remove(
    @Param('hojaId') hojaId: number,
    @Param('articuloId') articuloId: number,
  ) {
    return this.readonly.remove(hojaId, articuloId);
  }

  @Delete(':hojaId')
  @ApiOperation({
    summary: 'Permite eliminar un articulo de una hoja de precios por su id.',
  })
  @ApiOkResponse({ status: 200, description: 'Hoja de precios Ok' })
  removeSheet(@Param('id') id: number) {
    return this.readonly.removeSheet(id);
  }
}
