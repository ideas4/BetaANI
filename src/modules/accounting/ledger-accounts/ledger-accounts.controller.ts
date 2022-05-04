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
import { CreateLedgerAccountsDto } from './dto/create-ledger-accounts.dto';
import { UpdateLedgerAccountsDto } from './dto/update-ledger-accounts.dto';
import { LedgerAccountsService } from './ledger-accounts.service';

// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller('ledger-accounts')
@ApiTags('Ledger Accounts')
export class LedgerAccountsController {
  constructor(private readonly ledgerService: LedgerAccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear una cuenta bancaria' })
  @ApiOkResponse({ status: 200, description: 'Cuenta bancaria Ok' })
  @ApiNotAcceptableResponse({ description: 'La cuenta bancaria ya existe' })
  create(@Body() createLedgerAccountsDto: CreateLedgerAccountsDto) {
    return this.ledgerService.create(createLedgerAccountsDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Permite obtener una lista de las cuentas bancarias.',
  })
  @ApiOkResponse({ status: 200, description: 'Cuenta bancaria Ok' })
  findAll() {
    return this.ledgerService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Permite obtener la información de una cuenta bancaria.',
  })
  @ApiOkResponse({ status: 200, description: 'Cuenta bancaria Ok' })
  findOne(@Param('id') id: string) {
    return this.ledgerService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite modificar una cuenta bancaria' })
  @ApiOkResponse({ status: 200, description: 'Cuenta bancaria Ok' })
  @ApiNotAcceptableResponse({ description: 'La cuenta bancaria ya existe' })
  update(
    @Param('id') id: string,
    @Body() updateLedgerAccountDto: UpdateLedgerAccountsDto,
  ) {
    return this.ledgerService.update(+id, updateLedgerAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar una cuenta bancaria' })
  @ApiOkResponse({ status: 200, description: 'Cuenta bancaria Ok' })
  remove(@Param('id') id: string) {
    return this.ledgerService.remove(+id);
  }
}
