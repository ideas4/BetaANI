import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Auth } from '../users/services/auth/auth.decorator';
import { JWTPayload } from '../users/dtos/jwt-payload.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateQuoteClientDto } from './dto/create-quote-client.dto';

@Controller('quote')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiUnauthorizedResponse()
@ApiTags('Cotizaciones')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  @ApiOperation({ summary: 'Crea una cotización' })
  @ApiOkResponse({ status: 200, description: 'Cotización Ok' })
  create(@Body() createQuoteDto: CreateQuoteDto, @Auth() data: JWTPayload) {
    return this.quoteService.create(createQuoteDto, data.id);
  }

  @Post('/ecommerce')
  @ApiOperation({ summary: 'Crea una cotización desde ecommerce' })
  @ApiOkResponse({ status: 200, description: 'Cotización Ok' })
  createClient(
    @Body() createQuoteDto: CreateQuoteClientDto,
    @Auth() data: JWTPayload,
  ) {
    return this.quoteService.createClient(createQuoteDto, data.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las cotizaciones' })
  @ApiOkResponse({ status: 200, description: 'Cotización Ok' })
  findAll() {
    return this.quoteService.findAll();
  }

  @Get('/ecommerce')
  @ApiOperation({
    summary: 'Obtener todas las cotizaciones creadas por clientes',
  })
  @ApiOkResponse({ status: 200, description: 'Cotización Ok' })
  findAllClient() {
    return this.quoteService.findAllClient();
  }

  @Get('status')
  @ApiOperation({ summary: 'Obtener los estados para cotizaciones' })
  @ApiOkResponse({ status: 200, description: 'Cotización Ok' })
  findStatus() {
    return this.quoteService.findStatus();
  }

  @Get('time')
  @ApiOperation({ summary: 'Obtener la vigencia para cotizaciones' })
  @ApiOkResponse({ status: 200, description: 'Cotización Ok' })
  findTime() {
    return this.quoteService.findTime();
  }

  @Get('/ecommerce/:id')
  @ApiOperation({
    summary: 'Obtener el detalle de una cotización ingresada por el cliente',
  })
  @ApiOkResponse({ status: 200, description: 'Cotización Ok' })
  findOneClient(@Param('id') id: string) {
    return this.quoteService.findOneClient(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de una cotización' })
  @ApiOkResponse({ status: 200, description: 'Cotización Ok' })
  findOne(@Param('id') id: string) {
    return this.quoteService.findOne(+id);
  }

  @Put(':id/:status')
  @ApiOperation({ summary: 'Actualizar el estado de una cotización' })
  @ApiOkResponse({ status: 200, description: 'Cotización Ok' })
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.quoteService.updateStatus(id, status);
  }

  @Get('filtroCotizacion/:fechaStart/:fechaEnd')
  @ApiOperation({ summary: 'Permite obtener las cotizaciones por medio de un rango de fechas' })
  @ApiOkResponse({status: 200,description: 'Cotizacion Ok'})
  findDate(@Param('fechaStart') fechaStart: string, @Param('fechaEnd') fechaEnd:string) {
    // console.log(fechaStart, fechaEnd);
    return this.quoteService.filterDate(fechaStart, fechaEnd);
  }
}
