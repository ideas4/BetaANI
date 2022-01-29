import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/constants';
import { JWTPayload } from '../users/dtos/jwt-payload.dto';
import { Auth } from '../users/services/auth/auth.decorator';
import { SalesService } from './sales.service';

@Controller('sales')
@ApiTags('Sales')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiForbiddenResponse({ description: 'Frobidden' })
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('filtroFecha/:fechaStart/:fechaEnd')
  @ApiOperation({
    summary: 'Permite obtener las ventas por medio de un rango de fechas',
  })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  findDate(
    @Param('fechaStart') fechaStart: string,
    @Param('fechaEnd') fechaEnd: string,
  ) {
    // console.log(fechaStart, fechaEnd);
    return this.salesService.filterDate(fechaStart, fechaEnd);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de las ventas' })
  @ApiOkResponse({ status: 200, description: 'Ventas Ok' })
  findAll(@Auth() info: JWTPayload) {
    if (info.sucursal > 0 && info.rol != Roles.ADMINISTRADOR) {
      return this.salesService.findAllByStore(info.sucursal);
    } else {
      return this.salesService.findAll();
    }
  }
}
