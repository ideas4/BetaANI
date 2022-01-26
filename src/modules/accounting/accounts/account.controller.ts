import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from './services/account.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('accounts')
@ApiTags('Accounts')
export class AccountController {
    constructor(private readonly accountingItemService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear una cuenta' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  create(@Body() createAccountingItemDto: CreateAccountDto) {
    return this.accountingItemService.create(createAccountingItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de cuentas' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  findAll() {
    return this.accountingItemService.findAll();
  }

  @Get('fill')
  @ApiOperation({ summary: 'Permite obtener una lista de cuentas' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  fill() {
    return this.accountingItemService.findAllToFill();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Permite obtener una cuenta' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  findOne(@Param('id') id: string) {
    return this.accountingItemService.findOne(+id);
  }

  @Put('show/:id')
  @ApiOperation({ summary: 'Permite mostrar una cuenta en la lista' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  show(@Param('id') id: string) {
    return this.accountingItemService.showAccount(id);
  }

  @Put('hide/:id')
  @ApiOperation({ summary: 'Permite ocultar una cuenta en la lista' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  hide(@Param('id') id: string) {
    return this.accountingItemService.hideAccount(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite modificar una cuenta' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  //@ApiNotAcceptableResponse({description:'La cuenta ya existe'})
  update(@Param('id') id: string, @Body() updateAccountingItemDto: UpdateAccountDto) {
    return this.accountingItemService.update(+id, updateAccountingItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar una cuenta' })
  @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
  remove(@Param('id') id: string) {
    return this.accountingItemService.remove(+id);
  }
}
