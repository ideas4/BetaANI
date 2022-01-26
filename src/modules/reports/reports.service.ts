import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transforPropToString } from 'src/constants';
import { Repository } from 'typeorm';
import { AccountingMovement } from '../accounting/accounting-movements/entities/accounting-movement.entity';
import { Order } from '../orders/entities/order.entity';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(AccountingMovement)
    private repository: Repository<AccountingMovement>,
    @InjectRepository(Order) private repositoryOrders: Repository<Order>,
    private storeService:StoresService
  ) {}

  /**
   * Obtiene el reporte de movimientos en caja y ventas que se generan en el día 
   */
  async getPrettyCash(sucursal_id) {
    let egresos = await this.repository.createQueryBuilder('mov')
      .leftJoinAndSelect('mov.partida','partida')
      .leftJoinAndSelect('mov.tipo_movimiento','tipo_movimiento')
      .leftJoinAndSelect('mov.usuario','usuario')
      .leftJoin('mov.sucursal','sucursal')
      .where('sucursal.id = :sucursal_id',{sucursal_id})
      .andWhere('Date(mov.fecha) = (curdate())')
      .orderBy('mov.id')
      .getMany();
      transforPropToString(egresos,'partida',['nombre'])
      transforPropToString(egresos,'tipo_movimiento',['nombre'])
      transforPropToString(egresos,'usuario',['nombre','apellido'])
      let response = [];
      egresos.forEach(element => {
        response.push({
          id:element.id,
          tipo:'Egreso',
          nombre:element.nombre,
          monto:element.monto,
          fecha:new Date(element.fecha),
          descripcion_operacion: `Tipo de movimiento: ${element.tipo_movimiento}, asociado a partida "${element.partida}"`,
          usuario:element.usuario
        })
      });
    let ingresos = await this.repositoryOrders
    .createQueryBuilder('order')
      .leftJoinAndSelect('order.vendedor', 'vendedor')
      .leftJoin('order.estado_orden', 'estado')
      .where('order.estado_orden = 4')
      .andWhere('Date(order.fecha_confirmacion) = (curdate()) ')
      .orderBy('order.id')
      .getMany();
      transforPropToString(ingresos, 'vendedor', ['nombre', 'apellido']);
    
      ingresos.forEach(element => {
        response.push({
          id:element.id,
          tipo:'Ingreso',
          nombre:'Venta',
          monto:element.total,
          fecha:new Date(element.fecha_confirmacion),
          descripcion_operacion:`Cliente: ${element.cliente} con No. guia ${element.no_guia} y Factura asociada "${element.no_factura}"`,
          usuario:element.vendedor
        })
      });
      response.sort((a, b) => b.fecha - a.fecha)
      response.reverse();
      const sucursal = await this.storeService.findOne(sucursal_id);
      return {
        registros:response,
        caja_chica:sucursal.caja_chica
      };
  }
}
