import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { MoneyWithdrawService } from './money-withdraw.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateMoneyWithdrawTypeDto } from './dto/update-money-withdraw-type.dto';
import { CreateMoneyWithdrawTypeDto } from './dto/create-money-withdraw-type.dto';
import { Auth } from '../../users/services/auth/auth.decorator';
import { JWTPayload } from '../../users/dtos/jwt-payload.dto';
import { CreateMoneyWithdrawDto } from './dto/create-money-withdraw.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('money-withdrawal')
@ApiTags('Money Withdrawal')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class MoneyWithdrawController {
  constructor(private readonly moneyWithdrawService: MoneyWithdrawService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear un retiro' })
  @ApiOkResponse({status: 200,description: 'Retiro Ok'})
  @ApiBadRequestResponse({description:'El No. de boleta ya existe'})
  create(@Body() create: CreateMoneyWithdrawDto,@Auth() info:JWTPayload) {
    return this.moneyWithdrawService.create(create,info.id);
  }

  @Post('type')
  @ApiOperation({ summary: 'Permite crear un tipo de retiro bancario' })
  @ApiOkResponse({status: 200,description: 'Tipo de retiro Bancario Ok'})
  @ApiNotAcceptableResponse({description:'El tipo de retiro ya existe'})
  createType(@Body() create: CreateMoneyWithdrawTypeDto) {
    return this.moneyWithdrawService.createType(create)
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener lista de retiros' })
  @ApiOkResponse({status: 200,description: 'Deposito Ok'})
  findAll() {
    return this.moneyWithdrawService.findAll()
  }

  @Get('type')
  @ApiOperation({ summary: 'Permite obtener una lista de tipos de retiro bancario' })
  @ApiOkResponse({status: 200,description: 'Tipo de retiro Bancario Ok'})
  findAllType() {
    return this.moneyWithdrawService.findAllType()
  }

  @Get('type/fill')
  @ApiOperation({ summary: 'Permite obtener una lista de tipos de retiro bancario' })
  @ApiOkResponse({status: 200,description: 'Tipo de retiro Bancario Ok'})
  fill() {
    return this.moneyWithdrawService.findtoFillType()
  }

  @Get('type/:id')
  @ApiOperation({ summary: 'Permite obtener un tipo de retiro bancario' })
  @ApiOkResponse({status: 200,description: 'Tipo de retiro Bancario Ok'})
  findOne(@Param('id') id: string) {
    return this.moneyWithdrawService.findOneType(+id)
  }

  @Put('type/:id')
  @ApiOperation({ summary: 'Permite modificar un tipo de retiro bancario' })
  @ApiOkResponse({status: 200,description: 'Tipo de retiro Bancario Ok'})
  @ApiNotAcceptableResponse({description:'El tipo de retiro ya existe'})
  update(@Param('id') id: string, @Body() update: UpdateMoneyWithdrawTypeDto) {
    return this.moneyWithdrawService.updateType(+id,update)
  }

  @Delete('type/:id')
  @ApiOperation({ summary: 'Permite eliminar un tipo de retiro bancario' })
  @ApiOkResponse({status: 200,description: 'Tipo de retiro Bancario Ok'})
  remove(@Param('id') id: string) {
    return this.moneyWithdrawService.removeType(+id)
  }
}
