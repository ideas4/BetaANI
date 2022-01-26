import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('banks')
@ApiTags('Banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear un banco' })
  @ApiOkResponse({status: 200,description: 'Banco Ok'})
  @ApiNotAcceptableResponse({description:'El Banco ya existe'})
  create(@Body() createBankDto: CreateBankDto) {
    return this.banksService.create(createBankDto);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de bancos' })
  @ApiOkResponse({status: 200,description: 'Banco Ok'})
  findAll() {
    return this.banksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Permite obtener la información de un banco' })
  @ApiOkResponse({status: 200,description: 'Banco Ok'})
  findOne(@Param('id') id: string) {
    return this.banksService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite modificar un banco' })
  @ApiOkResponse({status: 200,description: 'Banco Ok'})
  @ApiNotAcceptableResponse({description:'El Banco ya existe'})
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return this.banksService.update(+id, updateBankDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar un banco' })
  @ApiOkResponse({status: 200,description: 'Banco Ok'})
  remove(@Param('id') id: string) {
    return this.banksService.remove(+id);
  }
}
