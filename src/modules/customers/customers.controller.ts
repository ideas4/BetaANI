import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('customers')
@ApiTags('Customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear un cliente' })
  @ApiOkResponse({ status: 200, description: 'Cliente Ok' })
  @ApiNotAcceptableResponse({ description: 'El Cliente ya existe' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de clientes' })
  @ApiOkResponse({ status: 200, description: 'Cliente Ok' })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Permite obtener la información de un cliente' })
  @ApiOkResponse({ status: 200, description: 'Cliente Ok' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite editar un cliente' })
  @ApiOkResponse({ status: 200, description: 'Cliente Ok' })
  @ApiNotAcceptableResponse({ description: 'El Cliente ya existe' })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar un cliente' })
  @ApiOkResponse({ status: 200, description: 'Cliente Ok' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }

  @Get('/client/:id')
  @ApiOperation({
    summary:
      'Permite obtener una lista de las todas las relaciones de cliente-hojaprecio',
  })
  @ApiOkResponse({ status: 200, description: 'Cliente Hoja de precios Ok' })
  findAllClientePriceSheet() {
    return this.customersService.findAllClient();
  }
}
