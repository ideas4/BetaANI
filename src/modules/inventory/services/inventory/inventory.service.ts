import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transforPropToString } from 'src/constants';
import { Connection, Repository } from 'typeorm';
import { CreateInventoryDto } from '../../dto/create-inventory.dto';
import { ModifyStockDto } from '../../dto/modify-stock.dto';
import { MoveStockDto } from '../../dto/move-stock.dto';
import { Inventory } from '../../entities/inventory.entity';
import { LogInventoryService } from '../log-inventory/log-inventory.service';
import { PdfGeneratorService } from '../../../../services/pdf-generator/pdf-generator.service';
import * as moment from 'moment';
import { log } from 'util';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory) private repository: Repository<Inventory>,
    private connection: Connection,
    private logInventoryService: LogInventoryService,
    private pdfservice: PdfGeneratorService,
  ) {}

  /**
   * Crear un registro en el inventario
   * @param createInventoryDto
   */
  newInventory(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    return this.repository.save(createInventoryDto);
  }

  /**
   * Obtener el inventario
   */
  async getInventory() {
    let result = await this.repository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.producto', 'producto')
      .leftJoinAndSelect('inv.sucursal', 'sucursal')
      .leftJoinAndSelect('producto.proveedor', 'proveedor')
      .leftJoinAndSelect('producto.marca', 'marca')
      .getMany();

    //formatear resultado
    result.forEach((element) => {
      element['producto_id'] = element.producto ? element.producto.id : '';
      element['nombre'] = element.producto ? element.producto.nombre : '';
      element['sku'] = element.producto ? element.producto.sku : '';
      element['marca'] = element.producto
        ? element.producto.marca
          ? element.producto.marca.nombre
          : ''
        : '';
      element['proveedor'] = element.producto
        ? element.producto.proveedor
          ? element.producto.proveedor.nombre
          : ''
        : '';
      element['precio_venta'] = element.producto
        ? element.producto.precio_venta
        : 0;
      element['precio_original'] = element.producto
        ? element.producto.precio_original
        : 0;
      element['nombre_sucursal'] = element.sucursal
        ? element.sucursal.nombre
        : '';
      delete element.producto;
      delete element.sucursal;
    });
    return result;
  }

  /**
   * Agregar stock a un producto
   * @param modifyStock
   */
  async addProductStock(modifyStock: ModifyStockDto) {
    //iniciando transaccion
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const inv = await this.repository.findOne(modifyStock.id_transaccion);
      if (inv) {
        const newCant = Number(inv.cantidad) + Number(modifyStock.cantidad);
        //actualizar cantidad
        let response = this.repository.update(inv.id, {
          cantidad: newCant,
        });
        //ingresar bitacora
        this.logInventoryService.addLog({
          cantidad_actual: newCant,
          cantidad_anterior: inv.cantidad,
          descripcion: 'Agregando existencias',
          fecha: new Date(),
          inventario: inv.id,
          notas: modifyStock.notas,
          usuario: modifyStock.usuario,
        });
        return (await response).affected;
      } else {
        throw new HttpException('No existe el registro de inventario', 400);
      }
    } catch (ex) {
      await queryRunner.rollbackTransaction();
      if (ex instanceof HttpException) {
        throw new HttpException(ex.message, ex.getStatus());
      } else {
        console.log(ex);
        throw new HttpException(JSON.stringify(ex), 500);
      }
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Agregar producto dañado
   * @param modifyStock
   */
  async addProductDamage(modifyStock: ModifyStockDto) {
    //iniciando transaccion
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const inv = await this.repository.findOne(modifyStock.id_transaccion);

      if (inv) {
        const newCant = Number(inv.cantidad) - Number(modifyStock.cantidad);
        const newCantdam =
          Number(inv.cantidad_daniada) + Number(modifyStock.cantidad);
        let response = this.repository.update(inv.id, {
          cantidad: newCant,
          cantidad_daniada: newCantdam,
        });
        this.logInventoryService.addLog({
          cantidad_actual: newCant,
          cantidad_anterior: inv.cantidad,
          descripcion: 'Retirando existencias dañadas',
          fecha: new Date(),
          inventario: inv.id,
          notas: modifyStock.notas,
          usuario: modifyStock.usuario,
        });
        return (await response).affected;
      } else {
        throw new HttpException('No existe el registro de inventario', 400);
      }
    } catch (ex) {
      await queryRunner.rollbackTransaction();
      if (ex instanceof HttpException) {
        throw new HttpException(ex.message, ex.getStatus());
      } else {
        console.log(ex);
        throw new HttpException(JSON.stringify(ex), 500);
      }
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Reservar producto
   * @param usuario
   * @param id
   * @param cantidad_reservada
   * @param cantidad
   * @param cantidad_anterior
   */
  async reserveProduct(
    usuario: string,
    id: number,
    cantidad_reservada: number,
    cantidad: number,
    cantidad_anterior: number,
  ) {
    await this.logInventoryService.addLog({
      cantidad_actual: cantidad,
      cantidad_anterior: cantidad_anterior,
      descripcion: 'Reserva de producto por orden',
      fecha: new Date(),
      inventario: id,
      notas: '',
      usuario: usuario,
    });
    return this.repository.update(id, { cantidad_reservada, cantidad });
  }

  /**
   * Mover producto de sucursal
   * @param moveStock
   * @param idUsuario
   */
  async moveProduct(moveStock: MoveStockDto, idUsuario: string) {
    //iniciando transaccion
    const queryRunner = this.connection.createQueryRunner();
    const nameFile = 'MV-' + this.getRandomName() + '.pdf';
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const origen = await this.repository.findOne({
        where: { sucursal: moveStock.sorigen, producto: moveStock.producto_id },
      });
      let destino = await this.repository.findOne({
        where: {
          sucursal: moveStock.sdestino,
          producto: moveStock.producto_id,
        },
      });
      if (origen) {
        if (origen.cantidad < moveStock.cantidad) {
          throw new HttpException(
            'Cantidad insuficiente de existencias en la sucursal',
            400,
          );
        }
        const newCantOrigen =
          Number(origen.cantidad) - Number(moveStock.cantidad);
        const newCantDestino =
          (destino ? Number(destino.cantidad) : 0) + Number(moveStock.cantidad);
        if (destino) {
          await this.repository.update(destino.id, {
            cantidad: newCantDestino,
          });
        } else {
          //si no existe, crearlo
          let invent = new CreateInventoryDto();
          invent.producto = Number(moveStock.producto_id);
          invent.sucursal = Number(moveStock.sdestino);
          invent.cantidad = Number(moveStock.cantidad);
          destino = await this.repository.save(invent);
        }
        //actualizar origen
        await this.repository.update(origen.id, {
          cantidad: newCantOrigen,
        });

        //log de origen
        const log1 = await this.logInventoryService.addLog({
          cantidad_actual: newCantOrigen,
          cantidad_anterior: origen.cantidad,
          descripcion: 'Envío de Productos',
          fecha: new Date(),
          inventario: origen.id,
          notas: '',
          usuario: idUsuario,
          pdf_name: nameFile,
        });

        const log2 = await this.logInventoryService.addLog({
          cantidad_actual: newCantDestino,
          cantidad_anterior: destino.cantidad,
          descripcion: 'Recepción de productos',
          fecha: new Date(),
          inventario: destino.id,
          notas: '',
          usuario: idUsuario,
          pdf_name: nameFile,
        });
        await this.generarPdfMovement(
          log1.id,
          log2.id,
          moveStock.cantidad,
          nameFile,
        );
        return true;
      } else {
        await queryRunner.rollbackTransaction();
        throw new HttpException(
          'No existe el producto en la sucursal de origen',
          400,
        );
      }
    } catch (ex) {
      await queryRunner.rollbackTransaction();
      if (ex instanceof HttpException) {
        throw new HttpException(ex.message, ex.getStatus());
      } else {
        console.log(ex);
        throw new HttpException(JSON.stringify(ex), 500);
      }
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Obtenenr el inventario de un producto
   * @param id id de producto
   */
  async getInventoryByProduct(id) {
    let result = await this.repository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.producto', 'producto')
      .leftJoinAndSelect('inv.sucursal', 'sucursal')
      .where('producto.id = :id', { id })
      .getMany();
    let info = [];

    result.forEach((element) => {
      info.push({
        nombre_sucursal: element.sucursal ? element.sucursal.nombre : '',
        id_sucursal: element.sucursal ? element.sucursal.id : '',
        direccion_sucursal: element.sucursal ? element.sucursal.direccion : '',
        precio_venta: element.producto ? element.producto.precio_venta : 0,
        precio_original: element.producto
          ? element.producto.precio_original
          : 0,
        cantidad: element.cantidad,
        cantidad_daniada: element.cantidad_daniada,
        cantidad_reservada: element.cantidad_reservada,
        producto_id: element.producto ? element.producto.id : '',
      });
    });
    return info;
  }

  /**
   * Obtener el inventario de una tienda
   * @param id_sucursal
   */
  async getInventoryByStore(id_sucursal: number) {
    if (id_sucursal < 0) {
      return [];
    }
    return await this.repository
      .createQueryBuilder('inv')
      .leftJoin('inv.sucursal', 'sucursal')
      .leftJoinAndSelect('inv.producto', 'producto')
      .where('inv.sucursal.id = :id_sucursal', { id_sucursal })
      .orderBy('inv.id')
      .getMany();
  }

  /**
   * Modificar el registro de inventario con las cantidades correctas de producto
   * @param id_inventario
   * @param cantidad
   * @param cantidad_reservada
   */
  async cancelOrder(
    id_inventario: number,
    cantidad: number,
    cantidad_reservada: number,
  ) {
    return this.repository.update(id_inventario, {
      cantidad,
      cantidad_reservada,
    });
  }

  /**
   * Modificar el registro de inventario con la nueva cantidad disponible
   * @param id_inventario
   * @param cantidad_reservada
   */
  async sellOrder(id_inventario: number, cantidad_reservada: number) {
    return this.repository.update(id_inventario, { cantidad_reservada });
  }

  /**
   * Buscar una cadena en el inventario
   * @param value cadena
   */
  async search(value: string) {
    let result = await this.repository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.producto', 'producto')
      .leftJoinAndSelect('inv.sucursal', 'sucursal')
      .leftJoinAndSelect('producto.proveedor', 'proveedor')
      .leftJoinAndSelect('producto.marca', 'marca')
      .where(`producto.nombre like '%${value}%'`)
      .orWhere(`sucursal.nombre like '%${value}%'`)
      .orWhere(`proveedor.nombre like '%${value}%'`)
      .orWhere(`marca.nombre like '%${value}%'`)
      .getMany();

    //formatear resultado
    result.forEach((element) => {
      element['producto_id'] = element.producto ? element.producto.id : '';
      element['nombre'] = element.producto ? element.producto.nombre : '';
      element['sku'] = element.producto ? element.producto.sku : '';
      element['marca'] = element.producto
        ? element.producto.marca
          ? element.producto.marca.nombre
          : ''
        : '';
      element['proveedor'] = element.producto
        ? element.producto.proveedor
          ? element.producto.proveedor.nombre
          : ''
        : '';
      element['precio_venta'] = element.producto
        ? element.producto.precio_venta
        : 0;
      element['precio_original'] = element.producto
        ? element.producto.precio_original
        : 0;
      element['nombre_sucursal'] = element.sucursal
        ? element.sucursal.nombre
        : '';
      delete element.producto;
      delete element.sucursal;
    });
    return result;
  }

  /**
   * Obtener productos del inventario por producto/sucursal
   * Llenado de select en crear orden
   */
  async findToFill() {
    var result = await this.repository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.producto', 'producto')
      .leftJoinAndSelect('inv.sucursal', 'sucursal')
      .leftJoinAndSelect('producto.proveedor', 'proveedor')
      .leftJoinAndSelect('producto.marca', 'marca')
      .where('inv.cantidad > 0')
      .getMany();
    var array = [];
    result.forEach((element) => {
      array.push({
        id: element.id,
        producto: element.producto.nombre,
        sucursal: element.sucursal ? element.sucursal.nombre : '',
        proveedor: element.producto.proveedor
          ? element.producto.proveedor.nombre
          : '',
        marca: element.producto.marca ? element.producto.marca.nombre : '',
      });
    });
    return array;
  }

  async findToFillProdPriceSheet(id: number) {
    var result = await this.repository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.producto', 'producto')
      .leftJoinAndSelect('inv.sucursal', 'sucursal')
      .leftJoinAndSelect('producto.proveedor', 'proveedor')
      .leftJoinAndSelect('producto.marca', 'marca')
      .where('inv.cantidad > 0')
      .getMany();
    var array = [];
    result.forEach((element) => {
      array.push({
        id: element.id,
        producto: element.producto.nombre,
        sucursal: element.sucursal ? element.sucursal.nombre : '',
        proveedor: element.producto.proveedor
          ? element.producto.proveedor.nombre
          : '',
        marca: element.producto.marca ? element.producto.marca.nombre : '',
      });
    });
    return array;
  }

  /**
   * Obtener un registro del inventario con el producto
   */
  async findToFillProduct(id: number) {
    let result = await this.repository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.producto', 'producto')
      .leftJoinAndSelect('inv.sucursal', 'sucursal')
      .leftJoinAndSelect('producto.proveedor', 'proveedor')
      .leftJoinAndSelect('producto.marca', 'marca')
      .where('inv.id = :id', { id })
      .andWhere('inv.cantidad > 0')
      .getOne();

    transforPropToString(result.producto, 'proveedor', ['nombre']);
    transforPropToString(result.producto, 'marca', ['nombre']);
    var producto = {
      id: result.id,
      nombre: result.producto.nombre,
      proveedor: result.producto.proveedor,
      marca: result.producto.marca,
      sku: result.producto.sku,
      cantidad_disponible: result.cantidad,
      precio: result.producto.precio_venta,
      precio_venta: result.producto.precio_venta,
      precio_min: result.producto.precio_min,
      sucursal: result.sucursal ? result.sucursal.nombre : '',
    };
    return producto;
  }

  /**
   * Obtener un producto para agregar a cotización
   */
  async findToQuote(id: number) {
    let result = await this.repository
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.producto', 'producto')
      .leftJoinAndSelect('inv.sucursal', 'sucursal')
      .leftJoinAndSelect('producto.proveedor', 'proveedor')
      .leftJoinAndSelect('producto.marca', 'marca')
      .leftJoinAndSelect('producto.imagenes', 'imagenes')
      .where('inv.producto.id = :id', { id })
      .andWhere('inv.cantidad > 0')
      .getMany();
    var producto;

    if (result.length > 0) {
      result[0].producto.imagenes = result[0].producto.imagenes.sort(
        (a, b) => a.prioridad - b.prioridad,
      );
      producto = {
        id: result[0].producto.id,
        nombre: result[0].producto.nombre,
        proveedor: result[0].producto.proveedor.nombre,
        marca: result[0].producto.marca.nombre,
        sku: result[0].producto.sku,
        precio: result[0].producto.precio_venta,
        imagen:
          result[0].producto.imagenes.length > 0
            ? result[0].producto.imagenes[0].url
            : '',
      };
    }
    let sucursales = [];
    result.forEach((value) => {
      sucursales.push({
        nombre: value.sucursal.nombre,
        cantidad: value.cantidad,
      });
    });

    return { producto, sucursales };
  }

  /**
   * Retornar las existencias disponibles
   * @param id de inventario
   */
  async haveExistences(id: string) {
    return (await this.repository.findOne(id)).cantidad;
  }

  /**
   * Obtener el registro de inventario
   * @param id de inventario
   */
  async getOne(id: string) {
    return this.repository.findOne(id, { relations: ['producto'] });
  }

  /**
   * Generar pdf
   * @param idLog1
   * @param idLog2
   * @param cantidad
   * @param nameFile
   * @private
   */
  private async generarPdfMovement(
    idLog1: number,
    idLog2: number,
    cantidad: number,
    nameFile: string,
  ) {
    console.log('generar pdf');
    const log1 = await this.logInventoryService.getLog(idLog1);
    const log2 = await this.logInventoryService.getLog(idLog2);
    //console.log(log1);
    //console.log(log2);
    if (!log1 || !log2) return;
    const values = [
      [
        moment(log1.fecha).format('DD/MM/YY, h:mm:ss a'),
        log1.usuario.nombre + ' ' + log1.usuario.apellido,
        log1.inventario.producto.sku,
        log1.inventario.producto.nombre,
        log1.inventario.sucursal.nombre,
        log1.descripcion,
        cantidad,
      ],
      [
        moment(log2.fecha).format('DD/MM/YY, h:mm:ss a'),
        log2.usuario.nombre + ' ' + log2.usuario.apellido,
        log2.inventario.producto.sku,
        log2.inventario.producto.nombre,
        log2.inventario.sucursal.nombre,
        log2.descripcion,
        cantidad,
      ],
    ];
    await this.pdfservice.genMovement(values, nameFile);
  }

  private getRandomName() {
    return Array(20)
      .fill(null)
      .map(() => Math.round(Math.random() * 10).toString(10))
      .join('');
  }
}
/**
 *
 * TRANSACCION
 //iniciando transaccion
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
    } catch (ex) {
      console.log(ex);
      if (ex instanceof HttpException) {
        throw new HttpException(ex.message, ex.getStatus());
      }
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
 */
