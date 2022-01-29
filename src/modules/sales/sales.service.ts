import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleEntity } from './entities/sale.entity';
import { Repository } from 'typeorm';
import { Store } from '../stores/entities/store.entity';
import { Order } from '../orders/entities/order.entity';
import { CreditCard } from '../accounting/credit-cards/entities/credit-card.entity';
import { LogBookService } from '../accounting/log-book/log-book.service';

@Injectable()
export class SalesService {
  constructor(
    private logBookService: LogBookService,
    @InjectRepository(SaleEntity) private repository: Repository<SaleEntity>,
    @InjectRepository(Store) private repositoryStore: Repository<Store>,
    @InjectRepository(CreditCard)
    private repositoryCard: Repository<CreditCard>,
  ) {}

  /**
   * Obtener las ventas por sucursal
   * @param id_sucursal
   */
  findAllByStore(id_sucursal: number) {
    console.log(id_sucursal);
    return this.repository.find({
      where: {
        sucursal: { id: id_sucursal },
      },
    });
  }

  /**
   * Obtener todas las ventas para el administrador
   */
  async findAll() {
    let result: any[] = await this.repository.find({
      relations: ['sucursal', 'orden', 'metodo_pago'],
    });
    result.forEach((value) => {
      value.orden = value.orden ? value.orden.id : 0;
      value.sucursal = value.sucursal ? value.sucursal.nombre : '';
      value.metodo_pago = value.metodo_pago ? value.metodo_pago.nombre : '';
    });
    return result;
  }

  /**
   * Registrar una venta
   * @param order
   * @param id_usuario
   * @param concepto
   * @param cuenta_id
   */
  async create(
    order: Order,
    id_usuario: string,
    concepto: string,
    cuenta_id: string,
  ) {
    const tarjeta = await this.repositoryCard.findOne({
      where: {
        orden: order,
      },
    });
    let result = await this.repository.save({
      fecha: new Date(),
      metodo_pago: order.metodo_pago,
      orden: order,
      sucursal: await this.repositoryStore.findOne(),
      tarjeta_id: tarjeta ? tarjeta.id : 0,
      total: order.total,
    });

    await this.logBookService.registerSale(
      {
        usuario: id_usuario,
        fecha: new Date(),
        total: result.total,
        haber: 1,
        debe: 0,
        concepto: concepto,
        cuenta: cuenta_id,
      },
      result,
    );
    return result;
  }

  async filterDate(fechaStart: string, fechaEnd: string) {
    let query = `SELECT orden.id, orden.fecha_confirmacion, orden.cliente, orden.nit_cliente, u.nombre as NombreU, u.apellido as ApellidoU, s.nombre as NombreSucursal, orden.no_factura, orden.total FROM orden
                left join usuario u on orden.vendedor_id = u.id
                left join estado_orden eo on orden.estado_orden_id = eo.id
                left join  sucursal s on u.sucursal_id = s.id
                WHERE CAST(orden.fecha_confirmacion as Date)
                BETWEEN STR_TO_DATE('${fechaStart} 00:00:00', '%d-%m-%Y %T') AND STR_TO_DATE('${fechaEnd} 23:59:00', '%d-%m-%Y %T');`;
    return this.repository.query(query);
  }
}
