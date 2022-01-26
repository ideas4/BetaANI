import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { DepositsService } from '../../services/deposits/deposits.service';
import { CreateDepositDto } from '../../dto/create-deposit.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JWTPayload } from 'src/modules/users/dtos/jwt-payload.dto';
import { Auth } from 'src/modules/users/services/auth/auth.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear un deposito' })
  @ApiOkResponse({status: 200,description: 'Deposito Ok'})
  @ApiBadRequestResponse({description:'El No. de boleta ya existe'})
  create(@Body() createDepositDto: CreateDepositDto,@Auth() info:JWTPayload) {
    return this.depositsService.create(createDepositDto,info.id);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener lista de depositos' })
  @ApiOkResponse({status: 200,description: 'Deposito Ok'})
  findAll() {
    return this.depositsService.findAll();
  }

}
