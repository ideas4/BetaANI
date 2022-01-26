import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateAccountingMovementTypeDto } from '../../dto/accounting-movement-type/create-accounting-movement-type.dto';
import { UpdateAccountingMovementTypeDto } from '../../dto/accounting-movement-type/update-accounting-movement-type.dto';
import { AccountingMovementTypeService } from '../../services/accounting-movement-type/accounting-movement-type.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('accounting-movement-type')
@ApiTags('Accounting Movements')
export class AccountingMovementTypeController {
  constructor(private readonly accountingMovementTypeService: AccountingMovementTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear un tipo de movimientos de caja' })
  @ApiOkResponse({status: 200,description: 'Movimiento Ok'})
  @ApiNotAcceptableResponse({description:'El tipo de movimiento ya existe'})
  create(@Body() createAccountingMovementTypeDto: CreateAccountingMovementTypeDto) {
    return this.accountingMovementTypeService.create(createAccountingMovementTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de tipos de movimientos de caja' })
  @ApiOkResponse({status: 200,description: 'Movimiento Ok'})
  findAll() {
    return this.accountingMovementTypeService.findAll();
  }


  @Get('fill')
  @ApiOperation({ summary: 'Permite obtener una lista de tipos de movimientos de caja' })
  @ApiOkResponse({status: 200,description: 'Movimiento Ok'})
  fill() {
    return this.accountingMovementTypeService.findToFill();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Permite obtener un tipo de movimiento de caja' })
  @ApiOkResponse({status: 200,description: 'Movimiento Ok'})
  findOne(@Param('id') id: string) {
    return this.accountingMovementTypeService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite editar un tipo de movimientos de caja' })
  @ApiOkResponse({status: 200,description: 'Movimiento Ok'})
  @ApiNotAcceptableResponse({description:'El tipo de movimiento ya existe'})
  update(@Param('id') id: string, @Body() updateAccountingMovementTypeDto: UpdateAccountingMovementTypeDto) {
    return this.accountingMovementTypeService.update(+id, updateAccountingMovementTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar un tipo de movimiento de caja' })
  @ApiOkResponse({status: 200,description: 'Movimiento Ok'})
  remove(@Param('id') id: string) {
    return this.accountingMovementTypeService.remove(+id);
  }
}
