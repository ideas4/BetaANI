import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transforPropToString } from 'src/constants';
import { Repository } from 'typeorm';
import { CreateLogInventoryDto } from '../../dto/create-log-inventory.dto';
import { LogInventory } from '../../entities/log-inventory.entity';

@Injectable()
export class LogInventoryService {
    constructor(@InjectRepository(LogInventory) private repository:Repository<LogInventory>){}

    /**
     * Agregar un registro del log
     * @param createLogInventoryDto
     */
    addLog(createLogInventoryDto:CreateLogInventoryDto){
        return this.repository.save(createLogInventoryDto);
    }

    /**
     * Obtener conjunto de logs
     * @param sucursal
     */
    async getLogs(sucursal:number){
        let query = this.repository.createQueryBuilder('log')
          .leftJoinAndSelect('log.usuario','usr')
          .leftJoinAndSelect('log.inventario','inv')
          .leftJoinAndSelect('inv.producto','prod')
          .leftJoinAndSelect('prod.proveedor','prov')
          .leftJoinAndSelect('inv.sucursal','sucursal')
        if(sucursal > 0){
            query.where('sucursal.id = :id',{id:sucursal})
        }
        query.orderBy('log.id')
        let result = await query.getMany();
        transforPropToString(result,'usuario',['nombre','apellido'])
        //format
        result.forEach(element => {
            element['sku'] = element.inventario?element.inventario.producto?element.inventario.producto.sku:'':'';
            element['producto'] = element.inventario?element.inventario.producto?element.inventario.producto.nombre:'':'';
            element['precio_original'] = element.inventario?element.inventario.producto?element.inventario.producto.precio_original:'':'';
            element['precio_venta'] = element.inventario?element.inventario.producto?element.inventario.producto.precio_venta:'':'';
            element['sucursal'] = element.inventario?element.inventario.sucursal?element.inventario.sucursal.nombre:'':'';
            element['proveedor'] = element.inventario?element.inventario.producto?element.inventario.producto.proveedor?
            element.inventario.producto.proveedor.nombre:'':'':'';
            delete element.inventario;
        });
        return result;
    }

    /**
     * Obtener un log
     * @param id
     */
    getLog(id:number){
        return this.repository.findOne(id,{relations:['usuario','inventario','inventario.producto','inventario.sucursal']})
    }
}