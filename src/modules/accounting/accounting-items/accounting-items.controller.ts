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
import { AccountingItemsService } from './accounting-items.service';
import { CreateAccountingItemsDto } from './dto/create-accounting-items.dto';
import { UpdateAccountingItemsDto } from './dto/update-accounting-items-dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Accounting-items')
@Controller('accounting-items')
export class AccountingItemsController {
  constructor(
    private readonly accountingItemsService: AccountingItemsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear una partida' })
  @ApiOkResponse({ status: 200, description: 'Partida Ok' })
  @ApiNotAcceptableResponse({ description: 'La partida ya existe.' })
  create(@Body() createAccountingItemsDto: CreateAccountingItemsDto) {
    return this.accountingItemsService.create(createAccountingItemsDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Permite obtener la lista de todas las partidas registradas.',
  })
  @ApiOkResponse({ status: 200, description: 'Partida Ok' })
  findAll() {
    return this.accountingItemsService.findAll();
  }

  @Get(':codigo')
  @ApiOperation({
    summary: 'Permite obtener la información de una partida en especifico.',
  })
  @ApiOkResponse({ status: 200, description: 'Partida Ok' })
  findOne(@Param('codigo') codigo: string) {
    return this.accountingItemsService.findOne(codigo);
  }

  @Put(':codigo')
  @ApiOperation({ summary: 'Permite modificar una partida' })
  @ApiOkResponse({ status: 200, description: 'Partida Ok' })
  @ApiNotAcceptableResponse({ description: 'La partida ya existe' })
  update(
    @Param('codigo') codigo: string,
    @Body() updateAccountingItemsDto: UpdateAccountingItemsDto,
  ) {
    return this.accountingItemsService.update(codigo, updateAccountingItemsDto);
  }

  @Delete(':codigo')
  @ApiOperation({ summary: 'Permite eliminar una partida' })
  @ApiOkResponse({ status: 200, description: 'Partida Ok' })
  remove(@Param('codigo') codigo: string) {
    return this.accountingItemsService.remove(codigo);
  }
}
