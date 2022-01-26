import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateAccountingMovementDto } from '../../dto/accounting-movements/create-accounting-movement.dto';
import { UpdateAccountingMovementDto } from '../../dto/accounting-movements/update-accounting-movement.dto';
import { AccountingMovementsService } from '../../services/accounting-movements/accounting-movements.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/modules/users/services/auth/auth.decorator';
import { JWTPayload } from 'src/modules/users/dtos/jwt-payload.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('accounting-movements')
@ApiTags('Accounting Movements')
export class AccountingMovementsController {
  constructor(private readonly accountingMovementsService: AccountingMovementsService) {}

  @Post()
  @ApiOperation({ summary: 'Permite Crear un movimiento de caja' })
  @ApiOkResponse({status: 200,description: 'Movimiento Ok'})
  create(@Body() createAccountingMovementDto: CreateAccountingMovementDto) {
    const sucursal_id = 1;
    return this.accountingMovementsService.create(createAccountingMovementDto,sucursal_id);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener un movimiento de caja' })
  @ApiOkResponse({status: 200,description: 'Movimiento Ok'})
  findAll(@Auth() info:JWTPayload) {
    return this.accountingMovementsService.findAll(info.sucursal);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Permite obtener movimiento de caja' })
  @ApiOkResponse({status: 200,description: 'Movimiento Ok'})
  findOne(@Param('id') id: string) {
    return this.accountingMovementsService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite editar un movimiento de caja' })
  @ApiOkResponse({status: 200,description: 'Movimiento Ok'})
  update(@Param('id') id: string, @Body() updateAccountingMovementDto: UpdateAccountingMovementDto) {
    return this.accountingMovementsService.update(+id, updateAccountingMovementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permiteeliminar un movimiento de caja' })
  @ApiOkResponse({status: 200,description: 'Movimiento Ok'})
  remove(@Param('id') id: string) {
    return this.accountingMovementsService.remove(+id);
  }
}
