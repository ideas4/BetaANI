import { Controller, Post, Get, Put, Delete,Body,Param, UseGuards } from '@nestjs/common';
import { CreateDepositTypeDto } from '../../dto/create-deposit-type.dto';
import { UpdateDepositTypeDto } from '../../dto/update-deposit-type.dto';
import { DepositTypeService } from '../../services/deposit-type/deposit-type.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('deposit-type')
@ApiTags('Deposit Type')
export class DepositTypeController {
    constructor(private readonly depositTypeService:DepositTypeService) {}

    @Post()
    @ApiOperation({ summary: 'Permite crear un tipo de depósito bancario' })
    @ApiOkResponse({status: 200,description: 'Tipo de depósito Bancario Ok'})
    @ApiNotAcceptableResponse({description:'El tipo de depósito ya existe'})
    create(@Body() createDepositTypeDto: CreateDepositTypeDto) {
      return this.depositTypeService.create(createDepositTypeDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Permite obtener una lista de tipos de depósito bancario' })
    @ApiOkResponse({status: 200,description: 'Tipo de depósito Bancario Ok'})
    findAll() {
      return this.depositTypeService.findAll();
    }
  
    @Get('fill')
    @ApiOperation({ summary: 'Permite obtener una lista de tipos de depósito bancario' })
    @ApiOkResponse({status: 200,description: 'Tipo de depósito Bancario Ok'})
    fill() {
      return this.depositTypeService.findtoFill();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Permite obtener un tipo de depósito bancario' })
    @ApiOkResponse({status: 200,description: 'Tipo de depósito Bancario Ok'})
    findOne(@Param('id') id: string) {
      return this.depositTypeService.findOne(+id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Permite modificar un tipo de depósito bancario' })
    @ApiOkResponse({status: 200,description: 'Tipo de depósito Bancario Ok'})
    @ApiNotAcceptableResponse({description:'El tipo de depósito ya existe'})
    update(@Param('id') id: string, @Body() updateDepositTypeDto: UpdateDepositTypeDto) {
      return this.depositTypeService.update(+id, updateDepositTypeDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Permite eliminar un tipo de depósito bancario' })
    @ApiOkResponse({status: 200,description: 'Tipo de depósito Bancario Ok'})
    remove(@Param('id') id: string) {
      return this.depositTypeService.remove(+id);
    }
}
