import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MetodoPago,
  MetodoEntrega,
  TipoOrden,
  transforPropToString,
} from 'src/constants';
import { Connection, Not, Repository } from 'typeorm';
import { InventoryService } from '../inventory/services/inventory/inventory.service';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { ProductOrder } from './entities/product-order.entity';
import { EstadoOrden } from '../../constants';
import { PdfGeneratorService } from 'src/services/pdf-generator/pdf-generator.service';
import { DeliveryType } from './entities/delivery-type.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { OrderStatus } from './entities/order-status.entity';
import { CreateOrderEcommerceDto } from './dto/create-order-ecommerce.dto';
import { Store } from '../stores/entities/store.entity';
import { ConfigEcommerce } from '../configurations/config-ecommerce/entities/config-ecommerce.entity';
import { DeliveryTypeDto } from './dto/delivery-type.dto';
import { PaymentMethodDto } from './dto/payment-method.dto';
import { Config } from '../configurations/config-admin/entities/config.entity';
import { Shipping } from '../shipping/entities/shipping.entity';
import { SendMailService } from '../../services/mailer/send-mail.service';
import { CreditCardsService } from '../accounting/credit-cards/credit-cards.service';
import { SalesService } from '../sales/sales.service';
import { ConfirmSellDto } from './dto/confirm-sell.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { findIndex } from 'rxjs/operators';
import { CreateProductDto } from '../inventory/dto/create-product.dto';
import { ProductOrderDto } from './dto/product-order.dto';
import { UpdateProductOrderDto } from './dto/update-product-order.dto';

export interface InventoryAToOrder {
  id_inventario: any;
  cantidad_reservada: number;
  cantidad_nueva: number;
  cantidad_anterior: number;
  descuento: number;
  justificacion_descuento: string;
  cantidad: number;
  precio: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repository: Repository<Order>,
    @InjectRepository(ProductOrder)
    private repositoryproducts: Repository<ProductOrder>,
    @InjectRepository(User) private repositoryUser: Repository<User>,
    @InjectRepository(DeliveryType)
    private repositoyDeliveryType: Repository<DeliveryType>,
    @InjectRepository(Config)
    private configsSettingsRepository: Repository<Config>,
    @InjectRepository(PaymentMethod)
    private repositoryPaymentMethod: Repository<PaymentMethod>,
    @InjectRepository(OrderStatus)
    private repositorystatus: Repository<OrderStatus>,
    @InjectRepository(Store) private repositoryStore: Repository<Store>,
    @InjectRepository(ConfigEcommerce)
    private configRepository: Repository<ConfigEcommerce>,
    @InjectRepository(Shipping)
    private shippingRepository: Repository<Shipping>,
    private inventoryService: InventoryService,
    private connection: Connection,
    private pdfService: PdfGeneratorService,
    private email: SendMailService,
    private creditCardService: CreditCardsService,
    private salesService: SalesService,
  ) {}

  /**
   * Crear una orden desde la administración
   * @param createOrderDto
   * @param id_usuario
   */
  async create(createOrderDto: CreateOrderDto, id_usuario: string) {
    const queryRunner = this.connection.createQueryRunner();
    let order = null;
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      //iniciando transaccion
      if (createOrderDto.productos.length < 0) {
        throw new HttpException(
          'La orden no tiene productos',
          HttpStatus.CONFLICT,
        );
      }
      const credit_card = createOrderDto.id_tarjeta;
      delete createOrderDto.id_tarjeta;
      const inventory: InventoryAToOrder[] = [];
      //calcular total
      let vTotal = 0;
      const shipping = await this.shippingRepository.findOne(
        createOrderDto.envio,
      );
      if (shipping) {
        vTotal = shipping.costo;
      }
      for (const element of createOrderDto.productos) {
        const cant = await this.inventoryService.haveExistences(
          element.id_inventario,
        );
        //verificar la cantidad disponible
        if (cant < element.cantidad) {
          throw new HttpException(
            'No hay existencias suficientes del producto en tienda para surtir la orden',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          const inventario = await this.inventoryService.getOne(
            element.id_inventario,
          );
          inventory.push({
            cantidad_reservada:
              inventario.cantidad_reservada + element.cantidad,
            cantidad_nueva: inventario.cantidad - element.cantidad,
            cantidad_anterior: inventario.cantidad,
            ...element,
          });
          vTotal += element.cantidad * element.precio - element.descuento;
        }
      }
      //crear orden
      order = await this.repository.save({
        fecha_creacion: createOrderDto.fecha_creacion,
        cliente: createOrderDto.cliente,
        direccion: createOrderDto.direccion,
        telefono: createOrderDto.telefono,
        no_guia: createOrderDto.no_guia,
        nit_cliente: createOrderDto.nit_cliente,
        no_factura: createOrderDto.no_factura,
        email: createOrderDto.email,
        tipo_entrega: createOrderDto.entrega,
        envio: shipping,
        estado_orden: createOrderDto.estado,
        vendedor: await this.repositoryUser.findOne(id_usuario),
        fecha_entrega: createOrderDto.fecha_entrega,
        metodo_pago: createOrderDto.metodo_pago,
        total: vTotal,
      });
      //reservar producto
      for (const element of inventory) {
        await this.inventoryService.reserveProduct(
          id_usuario,
          element.id_inventario,
          element.cantidad_reservada,
          element.cantidad_nueva,
          element.cantidad_anterior,
        );
        //guardar producto de orden
        await this.repositoryproducts.save({
          cantidad: element.cantidad,
          descuento: element.descuento,
          precio: element.precio,
          justificacion_descuento: element.justificacion_descuento,
          orden: order,
          inventario: element.id_inventario,
        });
      }
      if (credit_card) {
        if (credit_card != '') {
          await this.creditCardService.setOrder(credit_card, order);
        }
      }
      return order;
    } catch (ex) {
      await queryRunner.rollbackTransaction();
      if (ex instanceof HttpException) {
        throw new HttpException(ex.message, ex.getStatus());
      }
    } finally {
      await queryRunner.release();
      if (order) {
        await this.sendMail(order.id);
      }
    }
  }

  /**
   * Crear una orden desde e-commerce
   * @param createOrderDto
   * @param id_usuario
   * @param email_to_order
   */
  async createFromEcommerce(
    createOrderDto: CreateOrderEcommerceDto,
    id_usuario: string,
    email_to_order: string,
  ) {
    const idStore = await this.getPrincipalStore();
    const storeInventory = await this.inventoryService.getInventoryByStore(
      idStore.id,
    );
    // buscar sucursal principal
    const queryRunner = this.connection.createQueryRunner();
    try {
      var idOrder = null;
      await queryRunner.connect();
      await queryRunner.startTransaction();

      //iniciando transaccion
      if (createOrderDto.productos.length < 0) {
        throw new HttpException(
          'La orden no tiene productos',
          HttpStatus.CONFLICT,
        );
      }

      const inventory: InventoryAToOrder[] = [];
      //calcular total
      let vTotal = 0;
      const shipping = await this.shippingRepository.findOne(
        createOrderDto.envio,
      );
      if (shipping) {
        vTotal = shipping.costo;
      }
      for (const element of createOrderDto.productos) {
        const cant = storeInventory.find(
          (inv) => inv.producto.id == element.id,
        );
        if (!cant) {
          throw new HttpException(
            'No hay existencias suficientes del producto en tienda para surtir la orden',
            HttpStatus.BAD_REQUEST,
          );
        }
        //verificar la cantidad disponible
        if (cant.cantidad < element.cantidad) {
          throw new HttpException(
            'No hay existencias suficientes del producto en tienda para surtir la orden',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          const inventario = await this.inventoryService.getOne(
            cant.id.toString(),
          );
          inventory.push({
            cantidad_reservada:
              inventario.cantidad_reservada + element.cantidad,
            cantidad_nueva: inventario.cantidad - element.cantidad,
            cantidad_anterior: inventario.cantidad,
            cantidad: element.cantidad,
            descuento: 0,
            justificacion_descuento: '',
            precio: inventario.producto.precio_venta,
            id_inventario: inventario.id,
          });
          vTotal += element.cantidad * inventario.producto.precio_venta;
        }
      }
      //revisar cupon de descuento
      //crear orden
      createOrderDto.fecha_creacion = new Date();
      createOrderDto.fecha_entrega = new Date(); // ?????

      const res = await this.repository.save({
        fecha_creacion: createOrderDto.fecha_creacion,
        cliente: createOrderDto.cliente,
        direccion: createOrderDto.direccion,
        telefono: createOrderDto.telefono,
        //no_guia: null,
        //no_factura: null,
        nit_cliente: createOrderDto.nit_cliente,
        email: email_to_order,
        tipo_entrega: await this.repositoyDeliveryType.findOne(
          MetodoEntrega.REPARTIDOR,
        ), //createOrderDto.entrega,
        estado_orden: await this.repositorystatus.findOne(
          EstadoOrden.EN_TRANSITO,
        ), //createOrderDto.estado,
        fecha_entrega: createOrderDto.fecha_entrega,
        metodo_pago: await this.repositoryPaymentMethod.findOne(
          MetodoPago.PAGO_CONTRA_ENTEGA,
        ),
        total: vTotal,
        envio: shipping,
        tipo_orden: TipoOrden.ECOMMERCE,
      });
      idOrder = res.id;
      //reservar producto
      for (const element of inventory) {
        await this.inventoryService.reserveProduct(
          id_usuario,
          element.id_inventario,
          element.cantidad_reservada,
          element.cantidad_nueva,
          element.cantidad_anterior,
        );
        //guardar producto de orden
        await this.repositoryproducts.save({
          cantidad: element.cantidad,
          descuento: element.descuento,
          precio: element.precio,
          justificacion_descuento: element.justificacion_descuento,
          orden: res,
          inventario: element.id_inventario,
        });
      }
      return res;
    } catch (ex) {
      await queryRunner.rollbackTransaction();

      if (ex instanceof HttpException) {
        throw new HttpException(ex.message, ex.getStatus());
      } else {
        console.log(ex.message);
      }
    } finally {
      await queryRunner.release();
      if (idOrder) {
        await this.sendMail(idOrder);
      }
    }
  }

  /**
   * Obtener lista de ordenes
   * @param id_sucursal
   */
  async findAllByStore(id_sucursal: number) {
    const result = await this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.vendedor', 'vendedor')
      .leftJoinAndSelect('order.estado_orden', 'estado')
      .leftJoinAndSelect('vendedor.sucursal', 'sucursal')
      .where('order.estado_orden != ' + EstadoOrden.CONFIRMADO_VENTA)
      .andWhere('sucursal.id = 1')
      .orderBy('order.id')
      .getMany();
    transforPropToString(result, 'vendedor', ['nombre', 'apellido']);
    transforPropToString(result, 'estado_orden', ['nombre']);
    return result;
  }

  /**
   * Obtener una lista de ordenes de todas las sucursales
   */
  async findAll() {
    const result: any[] = await this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.vendedor', 'vendedor')
      .leftJoinAndSelect('order.estado_orden', 'estado')
      .leftJoinAndSelect('vendedor.sucursal', 'sucursal')
      .where('order.estado_orden != ' + EstadoOrden.CONFIRMADO_VENTA)
      .orderBy('order.id')
      .getMany();

    result.forEach((element) => {
      //format sucursal
      element['sucursal'] = element.vendedor
        ? element.vendedor.sucursal
          ? element.vendedor.sucursal.nombre
          : 'e-commerce'
        : 'e-commerce';
      //format vendedor
      if (element.vendedor) {
        transforPropToString(element, 'vendedor', ['nombre', 'apellido']);
      } else {
        element['vendedor'] = 'e-commerce';
      }
    });
    //format estado
    transforPropToString(result, 'estado_orden', ['nombre']);
    return result;
  }

  /**
   * Obtener una orden
   * @param id
   */
  async findOne(id: number) {
    const result = await this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.vendedor', 'vendedor')
      .leftJoinAndSelect('order.estado_orden', 'estado')
      .leftJoinAndSelect('order.tipo_entrega', 'entrega')
      .leftJoinAndSelect('order.metodo_pago', 'metodo')
      .leftJoinAndSelect('order.envio', 'envio')
      .where('order.id = :id', { id })
      .getOne();
    transforPropToString(result, 'vendedor', ['nombre', 'apellido']);
    result['estado'] = result.estado_orden ? result.estado_orden.nombre : '';
    result['estado_id'] = result.estado_orden ? result.estado_orden.id : '';
    result['entrega'] = result.tipo_entrega ? result.tipo_entrega.nombre : '';
    result['entrega_id'] = result.tipo_entrega ? result.tipo_entrega.id : '';
    result['m_pago'] = result.metodo_pago ? result.metodo_pago.nombre : '';
    result['m_pago_id'] = result.metodo_pago ? result.metodo_pago.id : '';
    result['envio_descrip'] = result.envio ? result.envio.nombre : '';
    result['envio_costo'] = result.envio ? result.envio.costo : '';
    result['envio_id'] = result.envio ? result.envio.id : '';
    delete result.estado_orden;
    delete result.tipo_entrega;
    delete result.metodo_pago;
    delete result.envio;
    result['productos'] = [];

    const prods = await this.repositoryproducts
      .createQueryBuilder('prod')
      .leftJoinAndSelect('prod.inventario', 'inventario')
      .leftJoinAndSelect('inventario.producto', 'p')
      .leftJoinAndSelect('inventario.sucursal', 's')
      .where('ordenId = :id', { id: result.id })
      .getMany();
    prods.forEach((element) => {
      element['sku'] = element.inventario
        ? element.inventario.producto
          ? element.inventario.producto.sku
          : ''
        : '';
      element['nombre'] = element.inventario
        ? element.inventario.producto
          ? element.inventario.producto.nombre
          : ''
        : '';
      element['idProducto'] = element.inventario.producto.id;
      element['idSucursal'] = element.inventario.sucursal.id;

      delete element.inventario;
    });
    result['productos'] = prods;
    return result;
  }

  /**
   * Confirmar orden como venta
   * @param id de orden
   * @param body
   * @param id_usuario
   */
  async confirmSel(id: number, body: ConfirmSellDto, id_usuario: string) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //liberar inventario reservado
      const order = await this.repository.findOne(id, {
        relations: ['metodo_pago', 'vendedor', 'vendedor.sucursal'],
      });
      await this.salesService.create(
        order,
        id_usuario,
        body.concepto,
        body.cuenta_id,
      );
      const products = await this.repositoryproducts
        .createQueryBuilder('prod')
        .leftJoinAndSelect('prod.inventario', 'inv')
        .where('ordenId = :id', { id })
        .getMany();
      products.forEach((element) => {
        const id_inventario = element.inventario ? element.inventario.id : null;
        const cantidad_reservada = element.inventario
          ? element.inventario.cantidad_reservada - element.cantidad
          : 0;
        if (id_inventario) {
          this.inventoryService.sellOrder(id_inventario, cantidad_reservada);
          //this.storeService.setPrettyCash(order.id,order.total);
        }
      });
      //actualizar estado
      return this.updateStatus(id, EstadoOrden.CONFIRMADO_VENTA);
    } catch (ex) {
      if (ex instanceof HttpException) {
        throw new HttpException(ex.message, ex.getStatus());
      } else {
        console.log(ex);
      }
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Confirmar orden como entregado
   * @param id
   */
  async confirmDelivery(id: number) {
    return this.updateStatus(id, EstadoOrden.ENTREGADO);
  }

  /**
   * Cancelar orden
   * al cancelar la orden se resta las cantidades al producto reservado y se suma al disponible
   *
   * @param id
   */
  async cancelOrder(id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //liberar inventario reservado
      const products = await this.repositoryproducts
        .createQueryBuilder('prod')
        .leftJoinAndSelect('prod.inventario', 'inv')
        .where('ordenId = :id', { id })
        .getMany();
      products.forEach((element) => {
        const id_inventario = element.inventario ? element.inventario.id : null;
        const cantidad = element.inventario
          ? element.inventario.cantidad + element.cantidad
          : 0;
        const cantidad_reservada = element.inventario
          ? element.inventario.cantidad_reservada - element.cantidad
          : 0;
        if (id_inventario) {
          this.inventoryService.cancelOrder(
            id_inventario,
            cantidad,
            cantidad_reservada,
          );
        }
      });
      //actualizar estado
      return this.updateStatus(id, EstadoOrden.ANULADO_POR_CLIENTE);
    } catch (ex) {
      if (ex instanceof HttpException) {
        throw new HttpException(ex.message, ex.getStatus());
      } else {
        console.log(ex);
      }
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Modifica el estado de una orden
   * @param id
   * @param status
   */
  private async updateStatus(id: number, status: any) {
    return (
      await this.repository.update(id, {
        estado_orden: status,
        fecha_confirmacion: new Date(),
      })
    ).affected;
  }

  /**
   * Obtener una lista de ventas para el administrador
   */
  async getSales() {
    const result = await this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.vendedor', 'vendedor')
      .leftJoin('order.estado_orden', 'estado')
      .leftJoinAndSelect('vendedor.sucursal', 'sucursal')
      .where('order.estado_orden = 4')
      .orderBy('order.id')
      .getMany();
    result.forEach((element) => {
      element['sucursal'] = element.vendedor
        ? element.vendedor.sucursal
          ? element.vendedor.sucursal.nombre
          : ''
        : '';
    });
    transforPropToString(result, 'vendedor', ['nombre', 'apellido']);
    return result;
  }

  /**
   * Obtener una lista de ventas por sucursal
   * @param id_sucursal
   */
  async getSalesByStore(id_sucursal: number) {
    const result = await this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.vendedor', 'vendedor')
      .leftJoin('order.estado_orden', 'estado')
      .leftJoinAndSelect('vendedor.sucursal', 'sucursal')
      .where('order.estado_orden = 4')
      .andWhere('sucursal.id = id', { id: id_sucursal })
      .orderBy('order.id')
      .getMany();
    result.forEach((element) => {
      element['sucursal'] = element.vendedor
        ? element.vendedor.sucursal
          ? element.vendedor.sucursal.nombre
          : ''
        : '';
    });
    transforPropToString(result, 'vendedor', ['nombre', 'apellido']);
    return result;
  }

  /**
   * Genera PDF con información de la orden
   * @param id de orden
   */
  async generatePdf(id: number) {
    const order: any = await this.findOne(id);
    //formar arreglo de datos de la orden en un arreglo de valores para concatenar
    const array = [];
    let contador = 1;
    let total = 0;
    order.productos.forEach((element) => {
      const subtotal = element.cantidad * element.precio - element.descuento;
      array.push([
        contador,
        element.sku,
        element.nombre,
        element.precio,
        element.descuento,
        element.cantidad,
        'Q.' + subtotal.toFixed(2),
      ]);
      contador++;
      total += subtotal;
    });
    this.pdfService.genOrder(order, array, total);
    return 'Ok';
  }

  /**
   * Envia un correo electrónico con la información de la orden
   * @param id
   */
  async sendMail(id: number) {
    const order = await this.findOne(id);
    await this.email.sendOrder(order, order.email);
    return 'Ok';
  }

  /**
   * Obtener los estados que puede tener una orden
   */
  async getStatus() {
    return await this.repositorystatus.find();
  }

  /**
   * Obtener los tipos de entrega entrega disponibles
   */
  async getDeliveryType() {
    return await this.repositoyDeliveryType.find();
  }

  /**
   * Obtener un tipo de entrega
   */
  async getDeliveryTypeId(id: number) {
    return await this.repositoyDeliveryType.findOne(id);
  }

  /**
   * Crear un tipo de entrega
   */
  async addDeliveryType(body: DeliveryTypeDto) {
    if (
      (await this.repositoyDeliveryType.count({
        where: { nombre: body.nombre },
      })) > 0
    ) {
      throw new HttpException(
        'Ya existe la forma de entrega',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.repositoyDeliveryType.save(body);
  }

  /**
   * Actualizar un tipo de entrega
   */
  async updateDeliveryType(id: number, body: DeliveryTypeDto) {
    if (
      (await this.repositoyDeliveryType.count({
        where: { nombre: body.nombre, id: Not(id) },
      })) > 0
    ) {
      throw new HttpException(
        'Ya existe la forma de entrega',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.repositoyDeliveryType.update(id, body);
  }

  /**
   * Obtener un tipo de entrega
   */
  async deleteDeliveryTypeId(id: number) {
    return await this.repositoyDeliveryType.delete(id);
  }

  /**
   * Obtener los metodos de pago disponibles
   */
  async getPaymentMethod() {
    return await this.repositoryPaymentMethod.find();
  }

  /**
   * Obtener un metodo de pago
   */
  async getPaymentId(id: number) {
    return await this.repositoryPaymentMethod.findOne(id);
  }

  /**
   * Crear un metodo de pago
   */
  async addPaymentMethod(body: PaymentMethodDto) {
    if (
      (await this.repositoryPaymentMethod.count({
        where: { nombre: body.nombre },
      })) > 0
    ) {
      throw new HttpException(
        'Ya existe el método de pago',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.repositoryPaymentMethod.save(body);
  }

  /**
   * Actualizar un tipo de entrega
   */
  async updatePaymentMethod(id: number, body: PaymentMethodDto) {
    if (
      (await this.repositoryPaymentMethod.count({
        where: { nombre: body.nombre, id: Not(id) },
      })) > 0
    ) {
      throw new HttpException(
        'Ya existe el método de pago',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.repositoryPaymentMethod.update(id, body);
  }

  /**
   * Obtener un tipo de entrega
   */
  async deletePaymentMethod(id: number) {
    return await this.repositoryPaymentMethod.delete(id);
  }

  /**
   * Retornar la sucursal seleccionada para surtir el e-commerce
   */
  async getPrincipalStore(): Promise<Store> {
    if ((await this.repositoryStore.count()) == 1) {
      return this.repositoryStore.findOne(1);
    } else {
      //buscar tienda seleccionada
      return this.repositoryStore.findOne(1);
    }
  }

  /**
   * Retornar las ordenes por un rango de fecha seleccionado y sucursal
   */
  async filterDate(fechaStart: string, fechaEnd: string, sucursal: string) {
    let query = ``;
    if (sucursal != 'Todas') {
      query = `SELECT orden.id, orden.fecha_creacion, orden.cliente, u.nombre as NombreU, u.apellido as ApellidoU, s.nombre as sucursalNombre, eo.nombre as estado, orden.total FROM orden
              left join usuario u on orden.vendedor_id = u.id
              left join  sucursal s on u.sucursal_id = s.id
              left join estado_orden eo on orden.estado_orden_id = eo.id
              WHERE s.nombre = '${sucursal}' AND CAST(fecha_creacion as Date)
              BETWEEN STR_TO_DATE('${fechaStart} 00:00:00', '%d-%m-%Y %T') AND STR_TO_DATE('${fechaEnd} 23:59:00', '%d-%m-%Y %T');`;
    } else {
      query = `SELECT orden.id, orden.fecha_creacion, orden.cliente, u.nombre as NombreU, u.apellido as ApellidoU, s.nombre as sucursalNombre, eo.nombre as estado, orden.total FROM orden
              left join usuario u on orden.vendedor_id = u.id
              left join estado_orden eo on orden.estado_orden_id = eo.id
              left join  sucursal s on u.sucursal_id = s.id
              WHERE CAST(fecha_creacion as Date)
              BETWEEN STR_TO_DATE('${fechaStart} 00:00:00', '%d-%m-%Y %T') AND STR_TO_DATE('${fechaEnd} 23:59:00', '%d-%m-%Y %T');`;
    }

    return this.repositoryStore.query(query);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const query = `UPDATE orden
                          SET orden.metodo_pago_id = ${updateOrderDto.metodo_pago},
                              orden.fecha_entrega = STR_TO_DATE('${updateOrderDto.fecha_entrega}', '%Y-%m-%d'),
                              orden.no_guia = ${updateOrderDto.no_guia},
                              orden.tipo_entrega_id = ${updateOrderDto.entrega},
                              orden.envio_id = ${updateOrderDto.envio}
                          where orden.id = ${id};`;

    return await this.repository.query(query);
  }

  async getInventario(idProducto: number, idSucursal: number) {
    return await this.repositoryproducts.query(
      `select * from inventario
      where inventario.producto_id = ${idProducto} AND inventario.sucursal_id = ${idSucursal}`,
    );
  }

  async addProductDetail(
    idOrden: number,
    idInventario: string,
    total: number,
    productOrder: ProductOrderDto,
  ) {
    // //ACTUALIZA EL INVENTARIO
    let inventario = await this.repositoryproducts.query(
      `select * from inventario where inventario.id = ${idInventario}`,
    );

    let cantidadNueva: number = productOrder.cantidad;
    let cantidadReservada = inventario?.[0]?.cantidad_reservada;
    let cantidad = inventario?.[0]?.cantidad;

    cantidadReservada = Number(cantidadReservada) + Number(cantidadNueva);
    cantidad = Number(cantidad) - Number(productOrder.cantidad);

    //RESERVAR PRODUCTO EN INVENTARIO
    let updateInventario = await this.repositoryproducts
      .query(`UPDATE inventario
    SET cantidad = ${cantidad},
        cantidad_reservada = ${cantidadReservada}
    where inventario.id = ${idInventario}`);

    //guardar producto de orden
    let addOrdenProduct = await this.repositoryproducts
      .query(`insert into orden_producto (cantidad, precio, descuento, justificacion_descuento, ordenId, inventario_id)
    values (${productOrder.cantidad},${productOrder.precio},${productOrder.descuento},'${productOrder.justificacion_descuento}',${idOrden},${productOrder.id_inventario}) `);

    //ACTUALIZAR PRECIO DE LA ORDEN
    let query2 = await this.repository.query(`
        update orden SET total = ${total} where id = ${idOrden}`);
  }

  //BORRA UN REGISTRO DE UNA ORDEN
  async deleteProductDetail(
    id: number,
    idOrdenProduct: number,
    updateOrderDto: UpdateOrderDto,
  ) {
    //console.log(updateOrderDto.total);
    let cantidadProducto = await this.repositoryproducts.query(
      `select cantidad from orden_producto where id= ${idOrdenProduct}`,
    );

    let valueCantidadProducto = cantidadProducto?.[0]?.cantidad;

    //LIBERAR INVENTARIO RESERVADO
    let inventario = await this.repositoryproducts
      .query(`select i.cantidad, i.cantidad_reservada, i.id from orden_producto
      inner join inventario i on orden_producto.inventario_id = i.id
      where orden_producto.id = ${idOrdenProduct};
      `);

    let valueCantidadReservada = inventario?.[0]?.cantidad_reservada;
    let valueCantidad = inventario?.[0]?.cantidad;
    let idInventario = inventario?.[0]?.id;

    // console.log('cantidad reservada invt' + valueCantidadReservada);
    // console.log('cantidad invt' + valueCantidad);

    valueCantidad = valueCantidad + valueCantidadProducto;
    valueCantidadReservada = valueCantidadReservada - valueCantidadProducto;

    let updateInventario = await this.repositoryproducts
      .query(`UPDATE inventario
      SET cantidad = ${valueCantidad},
          cantidad_reservada = ${valueCantidadReservada}
      where inventario.id = ${idInventario}`);

    //ELIMINA EL REGISTO DE LA TABLA ORDEN_PRODUCTO
    let query = await this.repositoryproducts.query(
      `delete from orden_producto where orden_producto.id = ${idOrdenProduct};`,
    );

    //ACTUALIZAR PRECIO DE LA ORDEN
    let query2 = await this.repositoryproducts.query(`
        update orden SET total = ${updateOrderDto.total} where id = ${id}`);
  }

  async updateProductOrden(
    idordenProduct: number,
    total: number,
    updateProductOrderDto: UpdateProductOrderDto,
  ) {
    //obtener id de inventario por medio del id de Orden product
    let inventario = await this.repositoryproducts
      .query(`select inventario.id, inventario.cantidad, inventario.cantidad_reservada, op.cantidad as cantidadOrdenProduct, op.ordenId from inventario
    inner join orden_producto op on inventario.id = op.inventario_id
    where op.id = ${idordenProduct};`);

    let idOrden = inventario?.[0]?.ordenId;
    let cantidadProductoOrdenActual = inventario?.[0]?.cantidadOrdenProduct;
    let inventarioCantidad = inventario?.[0]?.cantidad;
    let inventarioReserva = inventario?.[0]?.cantidad_reservada;
    let idInventario = inventario?.[0]?.id;

    // console.log(idOrden);
    // console.log(cantidadProductoOrdenActual);
    // console.log(inventarioCantidad);
    // console.log(inventarioReserva);

    if (updateProductOrderDto.cantidad > inventarioCantidad) {
      throw new HttpException(
        'La cantidad ingresada es mayor a cantidad disponible en el inventario.',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if (updateProductOrderDto.cantidad > cantidadProductoOrdenActual) {
        //LIBERA PRODUCTOS de inventario
        let aux = updateProductOrderDto.cantidad - cantidadProductoOrdenActual;

        inventarioCantidad = inventarioCantidad - aux;
        inventarioReserva = inventarioReserva + aux;

        let updateInventario = await this.repositoryproducts
          .query(`UPDATE inventario
        SET cantidad = ${inventarioCantidad},
            cantidad_reservada = ${inventarioReserva}
        where inventario.id = ${idInventario}`);

        //MODIFICA ORDEN PRODUCT CANTIDAD
        let updateModificarProduct = await this.repository.query(
          `UPDATE orden_producto SET cantidad=${updateProductOrderDto.cantidad}, descuento=${updateProductOrderDto.descuento}, justificacion_descuento='${updateProductOrderDto.justificacion_descuento}' where id =${idordenProduct};`,
        );

        //MODIFICA TOTAL DE ORDEN
        let query2 = await this.repositoryproducts.query(`
        update orden SET total = ${total} where id = ${idOrden}`);
      } else if (updateProductOrderDto.cantidad < cantidadProductoOrdenActual) {
        //LIBERA PRODUCTOS de inventario
        let aux = cantidadProductoOrdenActual - updateProductOrderDto.cantidad;

        inventarioCantidad = inventarioCantidad + aux;
        inventarioReserva = inventarioReserva - aux;

        let updateInventario = await this.repositoryproducts
          .query(`UPDATE inventario
        SET cantidad = ${inventarioCantidad},
            cantidad_reservada = ${inventarioReserva}
        where inventario.id = ${idInventario}`);

        //MODIFICA ORDEN PRODUCT CANTIDAD
        let updateModificarProduct = await this.repository.query(
          `UPDATE orden_producto SET cantidad=${updateProductOrderDto.cantidad}, descuento=${updateProductOrderDto.descuento}, justificacion_descuento='${updateProductOrderDto.justificacion_descuento}' where id =${idordenProduct};`,
        );

        //MODIFICA TOTAL DE ORDEN
        let query2 = await this.repositoryproducts.query(`
        update orden SET total = ${total} where id = ${idOrden}`);
      } else {
        //MODIFICA ORDEN PRODUCT CANTIDAD
        let updateModificarProduct = await this.repository.query(
          `UPDATE orden_producto SET cantidad=${updateProductOrderDto.cantidad}, descuento=${updateProductOrderDto.descuento}, justificacion_descuento='${updateProductOrderDto.justificacion_descuento}' where id =${idordenProduct};`,
        );

        //MODIFICA TOTAL DE ORDEN
        let query2 = await this.repositoryproducts.query(`
        update orden SET total = ${total} where id = ${idOrden}`);
      }
    }
  }
}
