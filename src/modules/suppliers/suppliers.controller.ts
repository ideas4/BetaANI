import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Catch,
  HttpException,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { response } from 'express';

@Controller('suppliers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear un proveedor' })
  @ApiOkResponse({ status: 200, description: 'Proveedor Ok' })
  @ApiNotAcceptableResponse({ description: 'El proveedor ya existe' })
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de proveedores' })
  @ApiOkResponse({ status: 200, description: 'Proveedor Ok' })
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get('fill')
  @ApiOperation({
    summary:
      'Permite crear una lista de nombre y clave de todos los proveedores',
  })
  @ApiOkResponse({ status: 200, description: 'Proveedor Ok' })
  fill() {
    return this.suppliersService.findtoFill();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Permite obtener la información de un proveedor para editar',
  })
  @ApiOkResponse({ status: 200, description: 'Proveedor Ok' })
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite modificar un proveedor' })
  @ApiOkResponse({ status: 200, description: 'Proveedor Ok' })
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(+id, updateSupplierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar un proveedor' })
  @ApiOkResponse({ status: 200, description: 'Proveedor Ok' })
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }
}
