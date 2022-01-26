import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { LogBookService } from './log-book.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('log-book')
@ApiTags('LogBook')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class LogBookController {
  constructor(private readonly logBookService: LogBookService) {}

  @Get()
  @ApiOperation({ summary: 'Permite obtener lista de detalle del libro diario por dia' })
  @ApiOkResponse({status: 200,description: 'Libro diario Ok'})
  getAllByDay(){
    return this.logBookService.getAllByDay();
  }

  @Get('all')
  @ApiOperation({ summary: 'Permite obtener lista de detalle del libro diario' })
  @ApiOkResponse({status: 200,description: 'Libro diario Ok'})
  getAll(){
    return this.logBookService.getAll();
  }

}
