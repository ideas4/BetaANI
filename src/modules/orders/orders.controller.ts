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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JWTPayload } from '../users/dtos/jwt-payload.dto';
import { Auth } from '../users/services/auth/auth.decorator';
import { Roles } from 'src/constants';
import { AuthDataPayload } from '../users/dtos/auth-data.dto';
import { DeliveryTypeDto } from './dto/delivery-type.dto';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { ConfirmSellDto } from './dto/confirm-sell.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateProductDto } from '../inventory/dto/create-product.dto';
import { ProductOrderDto } from './dto/product-order.dto';
import { UpdateProductOrderDto } from './dto/update-product-order.dto';

@ApiBearerAuth()
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Orders')
@ApiForbiddenResponse({ description: 'Frobidden' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear una orden de compra' })
  @ApiOkResponse({ status: 200, description: 'Orden Ok' })
  @ApiConflictResponse({ description: 'La orden no tiene productos' })
  @ApiBadRequestResponse({
    description:
      'No hay existencias suficientes del producto en tienda para surtir la orden',
  })
  create(@Body() createOrderDto: CreateOrderDto, @Auth() payload: JWTPayload) {
    return this.ordersService.create(createOrderDto, payload.id);
  }

  @Post('/ecommerce')
  @ApiOperation({
    summary: 'Permite crear una orden de compra desde el e-commerce',
  })
  @ApiOkResponse({ status: 200, description: 'Orden Ok' })
  @ApiConflictResponse({ description: 'La orden no tiene productos' })
  @ApiBadRequestResponse({
    description:
      'No hay existencias suficientes del producto en tienda para surtir la orden',
  })
  createFromEcommerce(
    @Body() createOrderDto: CreateOrderEcommerceDto,
    @Auth() payload: AuthDataPayload,
  ) {
    return this.ordersService.createFromEcommerce(
      createOrderDto,
      payload.id,
      payload.email,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene una lista de ordenes' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  findAll(@Auth() info: JWTPayload) {
    if (info.sucursal > 0 && info.rol != Roles.ADMINISTRADOR) {
      return this.ordersService.findAllByStore(info.sucursal);
    } else {
      return this.ordersService.findAll();
    }
  }

  @Get('store/:id')
  @ApiOperation({
    summary: 'Obtiene una lista de ordenes de una sucursal en particular',
  })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  @ApiUnauthorizedResponse({
    description: 'No tiene permiso para acceder a la información',
  })
  findAllByStore(@Param() id: number, @Auth() info: JWTPayload) {
    if (info.rol == Roles.ADMINISTRADOR) {
      //console.log('admin')
      return this.ordersService.findAllByStore(id);
    } else {
      //console.log("no admin")
      throw new HttpException(
        'No tiene permiso para acceder a la información',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('filtroFecha/:fechaStart/:fechaEnd/:sucursal')
  @ApiOperation({
    summary: 'Permite obtener las ordenes por medio de un rango de fechas',
  })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  findDate(
    @Param('fechaStart') fechaStart: string,
    @Param('fechaEnd') fechaEnd: string,
    @Param('sucursal') sucursal: string,
  ) {
    // console.log(fechaStart, fechaEnd);
    return this.ordersService.filterDate(fechaStart, fechaEnd, sucursal);
  }

  @Get('status')
  @ApiOperation({
    summary:
      'Obtiene una lista de los estados en los cuales pueden estar las ordenes',
  })
  @ApiOkResponse({ status: 200, description: 'Estados Ok' })
  getStatus() {
    return this.ordersService.getStatus();
  }

  @Get('delivery-type')
  @ApiOperation({
    summary: 'Obtiene una lista de los método de entrega disponibles',
  })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  getDeliveryType() {
    return this.ordersService.getDeliveryType();
  }

  @Get('delivery-type/:id')
  @ApiOperation({
    summary: 'Obtiene una lista de los método de entrega disponibles',
  })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  getDeliveryTypeId(@Param('id') id: string) {
    return this.ordersService.getDeliveryTypeId(+id);
  }

  @Get('payment-method')
  @ApiOperation({
    summary: 'Obtiene una lista de ordenes de los métodos de pago disponibles',
  })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  getPaymentMethod() {
    return this.ordersService.getPaymentMethod();
  }

  @Get('inventory/:id/:idSucursal')
  @ApiOperation({
    summary: 'Obtener el id del inventario segun el producto y la sucursal',
  })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  getInventoryId(
    @Param('id') id: number,
    @Param('idSucursal') idSucursal: number,
  ) {
    return this.ordersService.getInventario(id, idSucursal);
  }

  @Get('payment-method/:id')
  @ApiOperation({ summary: 'Obtiene un metodo de pago para edicion' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  getPaymentMethodID(@Param('id') id: string) {
    return this.ordersService.getPaymentId(+id);
  }

  @Put('product-order/:idOrder/:idProducto/:total')
  @ApiOperation({ summary: 'Crear un producto en una orden' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  addProductOrder(
    @Param('idOrder') idOrder: number,
    @Param('idProducto') idProducto: string,
    @Param('total') total: number,
    @Body() body: ProductOrderDto,
  ) {
    return this.ordersService.addProductDetail(
      idOrder,
      idProducto,
      total,
      body,
    );
  }

  @Put('sell/:id')
  @ApiOperation({ summary: 'Permite confirmar una orden como venta' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  toSell(
    @Param('id') id: string,
    @Body() body: ConfirmSellDto,
    @Auth() info: JWTPayload,
  ) {
    return this.ordersService.confirmSel(+id, body, info.id);
  }

  @Put('delivery-type/:id')
  @ApiOperation({ summary: 'Actualiza un método de entrega disponibles' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  updateDeliveryType(@Param('id') id: string, @Body() body: DeliveryTypeDto) {
    return this.ordersService.updateDeliveryType(+id, body);
  }

  @Put('payment-method/:id')
  @ApiOperation({ summary: 'Actualiza un método de pago disponibles' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  updatePaymentMethod(@Param('id') id: string, @Body() body: PaymentMethodDto) {
    return this.ordersService.updatePaymentMethod(+id, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Permite obtener el detalle de una orden' })
  @ApiOkResponse({ status: 200, description: 'Orden Ok' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite editar una orden.' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  updateOrder(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Put('cancel/:id')
  @ApiOperation({ summary: 'Permite cancelar una orden' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  toCancell(@Param('id') id: string) {
    return this.ordersService.cancelOrder(+id);
  }

  @Put('deleteProductOrder/:id/:idOrdenProduct')
  @ApiOperation({
    summary:
      'Permite borrar un registro en las ordenes y actualizar el monto de la orden.',
  })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  ToDeteleProductoOrder(
    @Param('id') id: number,
    @Param('idOrdenProduct') idOrdenProduct: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.deleteProductDetail(
      id,
      idOrdenProduct,
      updateOrderDto,
    );
  }

  @Put('updateProductOrder/:idOrdenProduct/:total')
  @ApiOperation({
    summary:
      'Permite editar la cantidad y el descuento de un producto de una orden.',
  })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  ToUpdateItemsProductOrder(
    @Param('idOrdenProduct') idOrdenProduct: number,
    @Param('total') total: number,
    @Body() updateProductOrderDto: UpdateProductOrderDto,
  ) {
    return this.ordersService.updateProductOrden(
      idOrdenProduct,
      total,
      updateProductOrderDto,
    );
  }

  @Put('delivery/:id')
  @ApiOperation({ summary: 'Permite confirmar una orden como entregada' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  toDelivery(@Param('id') id: string) {
    return this.ordersService.confirmDelivery(+id);
  }

  @Delete('delivery-type/:id')
  @ApiOperation({ summary: 'Eliminar un método de entrega disponibles' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  delete(@Param('id') id: string) {
    return this.ordersService.deleteDeliveryTypeId(+id);
  }

  @Delete('payment-method/:id')
  @ApiOperation({ summary: 'Eliminar un método de pago disponibles' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  deletePayment(@Param('id') id: string) {
    return this.ordersService.deletePaymentMethod(+id);
  }

  @Post('delivery-type')
  @ApiOperation({ summary: 'Crea un nuevo método de entrega' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  addDeliveryType(@Body() body: DeliveryTypeDto) {
    return this.ordersService.addDeliveryType(body);
  }

  @Post('payment-method')
  @ApiOperation({ summary: 'Crea un nuevo método de pago' })
  @ApiOkResponse({ status: 200, description: 'Ordenes Ok' })
  addPaymentMethod(@Body() body: PaymentMethodDto) {
    return this.ordersService.addPaymentMethod(body);
  }
}
