import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountTypeService } from './services/account-type.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('accounting-item-type')
@ApiTags('Accounts')
export class AccountTypeController {
  constructor(private readonly accountingItemTypeService: AccountTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Permite Crear un tipo de cuenta' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  @ApiNotAcceptableResponse({description:'El tipo de cuenta ya existe'})
  create(@Body() createAccountingItemTypeDto: CreateAccountTypeDto) {
    return this.accountingItemTypeService.create(createAccountingItemTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de cuentas' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  findAll() {
    return this.accountingItemTypeService.findAll();
  }
  
  @Get('fill')
  @ApiOperation({ summary: 'Permite obtener una lista de cuentas' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  fill() {
    return this.accountingItemTypeService.findToFill();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Permite obtener información de una cuenta' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  findOne(@Param('id') id: string) {
    return this.accountingItemTypeService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite editar un tipo de cuenta' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  @ApiNotAcceptableResponse({description:'El tipo de cuenta ya existe'})
  update(@Param('id') id: string, @Body() updateAccountingItemTypeDto: UpdateAccountTypeDto) {
    return this.accountingItemTypeService.update(+id, updateAccountingItemTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar una cuenta' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  remove(@Param('id') id: string) {
    return this.accountingItemTypeService.remove(+id);
  }
}
