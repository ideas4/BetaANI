import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('bank-accounts')
@ApiTags('Bank Accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  /**
   * Crear una cuenta bancaria
   * @param createBankAccountDto 
   */
  @Post()
  @ApiOperation({ summary: 'Permite crear una cuenta de banco' })
  @ApiOkResponse({status: 200,description: 'Cuenta de Banco Ok'})
  @ApiNotAcceptableResponse({description:'La cuenta banco ya existe'})
  create(@Body() createBankAccountDto: CreateBankAccountDto) {
    return this.bankAccountsService.create(createBankAccountDto);
  }

  /**
   * Obtener todas las cuentas bancarias
   */
  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de cuentas bancarias' })
  @ApiOkResponse({status: 200,description: 'Cuenta de Banco Ok'})
  findAll() {
    return this.bankAccountsService.findAll();
  }

  /**
   * Obtener los tipos de cuentas bancarias
   */
  @Get('type')
  @ApiOperation({ summary: 'Permite obtener una lista de tipos de cuentas bancarias' })
  @ApiOkResponse({status: 200,description: 'Cuenta de Banco Ok'})
  findType() {
    return this.bankAccountsService.findType();
  }

  /**
   * Obtener cuentas para selects y combobox
   */
  @Get('fill')
  @ApiOperation({ summary: 'Permite obtener una lista de cuentas bancarias' })
  @ApiOkResponse({status: 200,description: 'Cuenta de Banco Ok'})
  fill() {
    return this.bankAccountsService.fill();
  }

  /**
   * Obtener cuenta bancaria para mostrar en edición
   * @param id de cuenta
   */
  @Get(':id')
  @ApiOperation({ summary: 'Permite obtener una cuenta bancaria' })
  @ApiOkResponse({status: 200,description: 'Cuenta de Banco Ok'})
  findOne(@Param('id') id: string) {
    return this.bankAccountsService.findOne(+id);
  }

  /**
   * Mostrar detalle de cuenta y lista de movimientos bancarios relacionados
   * @param id de cuenta
   */
  @Get('detail/:id')
  @ApiOperation({ summary: 'Permite obtener el detalle de una cuenta bancaria' })
  @ApiOkResponse({status: 200,description: 'Cuenta de Banco Ok'})
  findDetailOne(@Param('id') id: string) {
    return this.bankAccountsService.getDetail(+id);
  }

  /**
   * Modificar cuenta bancaria
   * @param id de cuenta
   * @param updateBankAccountDto 
   */
  @Put(':id')
  @ApiOperation({ summary: 'Permite modificar una cuenta de banco' })
  @ApiOkResponse({status: 200,description: 'Cuenta de Banco Ok'})
  @ApiNotAcceptableResponse({description:'La cuenta banco ya existe'})
  update(@Param('id') id: string, @Body() updateBankAccountDto: UpdateBankAccountDto) {
    return this.bankAccountsService.update(+id, updateBankAccountDto);
  }

  /**
   * Elminar cuenta bancaria
   * @param id 
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar una cuenta de banco' })
  @ApiOkResponse({status: 200,description: 'Cuenta de Banco Ok'})
  remove(@Param('id') id: string) {
    return this.bankAccountsService.remove(+id);
  }
}
