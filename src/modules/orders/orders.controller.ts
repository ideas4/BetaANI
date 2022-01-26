import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Request,
  UseGuards,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderEcommerceDto } from './dto/create-order-ecommerce.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JWTPayload } from '../users/dtos/jwt-payload.dto';
import { Auth } from '../users/services/auth/auth.decorator';
import { Roles } from 'src/constants';
import { AuthDataPayload } from '../users/dtos/auth-data.dto';
import { DeliveryTypeDto } from './dto/delivery-type.dto';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { ConfirmSellDto } from './dto/confirm-sell.dto';

@ApiBearerAuth()
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Orders')
@ApiForbiddenResponse({description:'Frobidden'})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear una orden de compra' })
  @ApiOkResponse({status: 200,description: 'Orden Ok'})
  @ApiConflictResponse({description:'La orden no tiene productos'})
  @ApiBadRequestResponse({description:'No hay existencias suficientes del producto en tienda para surtir la orden'})
  create(@Body() createOrderDto: CreateOrderDto,@Auth() payload:JWTPayload) {
    return this.ordersService.create(createOrderDto,payload.id);
  }

  @Post('/ecommerce')
  @ApiOperation({ summary: 'Permite crear una orden de compra desde el e-commerce' })
  @ApiOkResponse({status: 200,description: 'Orden Ok'})
  @ApiConflictResponse({description:'La orden no tiene productos'})
  @ApiBadRequestResponse({description:'No hay existencias suficientes del producto en tienda para surtir la orden'})
  createFromEcommerce(@Body() createOrderDto: CreateOrderEcommerceDto,@Auth() payload:AuthDataPayload) {
    return this.ordersService.createFromEcommerce(createOrderDto,payload.id,payload.email);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene una lista de ordenes' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  findAll(@Auth() info:JWTPayload) {
    if(info.sucursal > 0 && info.rol != Roles.ADMINISTRADOR){
      return this.ordersService.findAllByStore(info.sucursal);
    }else {
      return this.ordersService.findAll();
    }
  }

  @Get('store/:id')
  @ApiOperation({ summary: 'Obtiene una lista de ordenes de una sucursal en particular' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  @ApiUnauthorizedResponse({description:'No tiene permiso para acceder a la información'})
  findAllByStore(@Param() id:number,@Auth() info:JWTPayload) {
    if(info.rol == Roles.ADMINISTRADOR){
      //console.log('admin')
      return this.ordersService.findAllByStore(id);
    }else {
      //console.log("no admin")
      throw new HttpException('No tiene permiso para acceder a la información',HttpStatus.BAD_REQUEST);
    }
  }

  @Get('status')
  @ApiOperation({ summary: 'Obtiene una lista de los estados en los cuales pueden estar las ordenes' })
  @ApiOkResponse({status: 200,description: 'Estados Ok'})
  getStatus() {
    return this.ordersService.getStatus();
  }

  @Get('delivery-type')
  @ApiOperation({ summary: 'Obtiene una lista de los método de entrega disponibles' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  getDeliveryType() {
    return this.ordersService.getDeliveryType();
  }

  @Get('delivery-type/:id')
  @ApiOperation({ summary: 'Obtiene una lista de los método de entrega disponibles' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  getDeliveryTypeId(@Param('id') id:string) {
    return this.ordersService.getDeliveryTypeId(+id);
  }

  @Get('payment-method')
  @ApiOperation({ summary: 'Obtiene una lista de ordenes de los métodos de pago disponibles' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  getPaymentMethod() {
    return this.ordersService.getPaymentMethod();
  }

  @Get('payment-method/:id')
  @ApiOperation({ summary: 'Obtiene un metodo de pago para edicion' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  getPaymentMethodID(@Param('id') id:string) {
    return this.ordersService.getPaymentId(+id);
  }

  @Put('sell/:id')  
  @ApiOperation({ summary: 'Permite confirmar una orden como venta' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  toSell(@Param('id') id: string,@Body() body:ConfirmSellDto,@Auth() info:JWTPayload) {
    return this.ordersService.confirmSel(+id,body,info.id);
  }

  @Put('delivery-type/:id')
  @ApiOperation({ summary: 'Actualiza un método de entrega disponibles' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  updateDeliveryType(@Param('id') id:string,@Body() body:DeliveryTypeDto) {
    return this.ordersService.updateDeliveryType(+id,body);
  }

  @Put('payment-method/:id')
  @ApiOperation({ summary: 'Actualiza un método de pago disponibles' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  updatePaymentMethod(@Param('id') id:string,@Body() body:PaymentMethodDto) {
    return this.ordersService.updatePaymentMethod(+id,body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Permite obtener el detalle de una orden' })
  @ApiOkResponse({status: 200,description: 'Orden Ok'})
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Put('cancel/:id')
  @ApiOperation({ summary: 'Permite cancelar una orden' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  toCancell(@Param('id') id: string) {
    return this.ordersService.cancelOrder(+id);
  }

  @Put('delivery/:id')
  @ApiOperation({ summary: 'Permite confirmar una orden como entregada' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  toDelivery(@Param('id') id: string) {
    return this.ordersService.confirmDelivery(+id);
  }

  @Delete('delivery-type/:id')
  @ApiOperation({ summary: 'Eliminar un método de entrega disponibles' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  delete(@Param('id') id:string) {
    return this.ordersService.deleteDeliveryTypeId(+id);
  }

  @Delete('payment-method/:id')
  @ApiOperation({ summary: 'Eliminar un método de pago disponibles' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  deletePayment(@Param('id') id:string) {
    return this.ordersService.deletePaymentMethod(+id);
  }


  @Post('delivery-type')
  @ApiOperation({ summary: 'Crea un nuevo método de entrega' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  addDeliveryType(@Body() body: DeliveryTypeDto) {
    return this.ordersService.addDeliveryType(body);
  }

  @Post('payment-method')
  @ApiOperation({ summary: 'Crea un nuevo método de pago' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  addPaymentMethod(@Body() body: PaymentMethodDto) {
    return this.ordersService.addPaymentMethod(body);
  }

  @Get('filtroFecha/:fechaStart/:fechaEnd')
  @ApiOperation({ summary: 'Permite obtener las ordenes por medio de un rango de fechas' })
  @ApiOkResponse({status: 200,description: 'Ordenes Ok'})
  findDate(@Param('fechaStart') fechaStart: string, @Param('fechaEnd') fechaEnd:string) {
    // console.log(fechaStart, fechaEnd);
    return this.ordersService.filterDate(fechaStart, fechaEnd);
  }
}
