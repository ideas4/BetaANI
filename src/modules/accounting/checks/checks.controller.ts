import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from '../../users/services/auth/auth.decorator';
import { JWTPayload } from '../../users/dtos/jwt-payload.dto';

@Controller('checks')
@ApiTags('Checks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear un cheque' })
  @ApiOkResponse({status: 200,description: 'Cheque Ok'})
  @ApiBadRequestResponse({description:'El No. de cheque ya fue registrado'})
  create(@Body() createCheckDto: CreateCheckDto,@Auth() info:JWTPayload) {
    return this.checksService.create(createCheckDto,info.id);
  }

  @Get()
  @ApiOperation({ summary: 'Permite listar cheques' })
  @ApiOkResponse({status: 200,description: 'Cheque Ok'})
  findAll() {
    return this.checksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Permite obtener la información de un cheque' })
  @ApiOkResponse({status: 200,description: 'Cheque Ok'})
  findOne(@Param('id') id: string) {
    return this.checksService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite editar un cheque' })
  @ApiOkResponse({status: 200,description: 'Cheque Ok'})
  @ApiBadRequestResponse({description:'El No. de cheque ya fue registrado'})
  update(@Param('id') id: string, @Body() updateCheckDto: UpdateCheckDto) {
    return this.checksService.update(+id, updateCheckDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar un cheque' })
  @ApiOkResponse({status: 200,description: 'Cheque Ok'})
  @ApiBadRequestResponse({description:'No se pudo eliminar el cheque'})
  remove(@Param('id') id: string) {
    return this.checksService.remove(+id);
  }
}
