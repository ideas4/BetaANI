import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('credit-cards')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Credit Cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  @ApiOperation({ summary: 'Permite registrar una tarjeta de crédito' })
  @ApiOkResponse({status: 200,description: 'Tarjeta Ok'})
  create(@Body() createCreditCardDto: CreateCreditCardDto) {
    return this.creditCardsService.create(createCreditCardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de registros de tarjetas de créditos' })
  @ApiOkResponse({status: 200,description: 'Tarjeta Ok'})
  findAll() {
    return this.creditCardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditCardsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCreditCardDto: UpdateCreditCardDto) {
    return this.creditCardsService.update(+id, updateCreditCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditCardsService.remove(+id);
  }
}
