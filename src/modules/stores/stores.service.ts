import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transforPropToString } from 'src/constants';
import { Repository } from 'typeorm';
import { InventoryService } from '../inventory/services/inventory/inventory.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private repository: Repository<Store>,
    private inventoryService: InventoryService,
  ) {}

  /**
   * Permite crear una sucursal
   * @param createStoreDto
   */
  async create(createStoreDto: CreateStoreDto) {
    if (!(await this.repository.findOne({ nombre: createStoreDto.nombre }))) {
      return this.repository.save(createStoreDto);
    } else {
      throw new HttpException(
        'La sucursal ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  /**
   * Obtiene una lista con toda la información de las sucursales
   */
  async findAll() {
    let result = await this.repository
      .createQueryBuilder('store')
      .select([
        'store.id',
        'store.nombre',
        'store.direccion',
        'store.notas',
        'user.apellido',
        'user.nombre',
      ])
      .leftJoin('store.encargado', 'user')
      .orderBy('store.id')
      .getMany();
    transforPropToString(result, 'encargado', ['nombre', 'apellido']);
    return result;
  }

  /**la información de una sucursal
   * Obtiene
   * @param id de sucursal
   */
  findOne(id: number) {
    return this.repository.findOne(id);
  }

  /**
   * Modifica una sucursal
   * @param id de sucursal
   * @param updateStoreDto
   */
  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const inst = await this.repository.findOne({
      nombre: updateStoreDto.nombre,
    });
    if (!inst || inst.id == id) {
      return (await this.repository.update(id, updateStoreDto)).affected;
    } else {
      throw new HttpException(
        'La sucursal ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  /**
   * Elimina una sucursal
   * @param id de sucursal
   */
  async remove(id: number) {
    return (await this.repository.delete(id)).affected;
  }

  /**
   * Obtiene una lista con el nombre y la clave de las sucursales
   */
  async findtoFill() {
    const fill = await this.repository
      .createQueryBuilder('obj')
      .select(['obj.id', 'obj.nombre'])
      .getMany();
    return fill;
  }

  /**
   * Obtiene una lista con el nombre y la clave de las sucursales que no pertenezca ese usuario.
   */
  async findtoUser(id) {
    const query = `select * from sucursal where nombre != '${id}';`;
    const fill = await this.repository.query(query);
    return fill;
  }

  /**
   * Obtiene una lista de sucursal dependiendo el rol del usuario.
   */
  async findStoreforUser(rol, sucursal) {
    let query = ``;
    if (rol == 'Administrador') {
      query = `select s.id, s.nombre from usuario
                inner join rol r on usuario.rol_id = r.id
                inner join sucursal s on usuario.id = s.encargado_id
                where r.nombre = '${rol}';`;
    } else {
      query = `select * from sucursal
                where sucursal.nombre = '${sucursal}';`;
    }
    const fill = await this.repository.query(query);

    return fill;
  }

  /**
   * Obtiene las sucursales en las cuales hay existencia de producto
   * @param id de producto
   */
  async findtoFillProd(id) {
    const result = await this.inventoryService.getInventoryByProduct(id);
    let stores = [];
    result.forEach((element) => {
      if (element.producto_id == id) {
        stores.push({
          id: element.id_sucursal,
          nombre: element.nombre_sucursal,
        });
      }
    });
    return stores;
  }

  /**
   * Actualizar la caja chica de la sucursal
   * @param sucursal_id
   * @param total
   */
  async setPrettyCash(sucursal_id: number, total: number) {
    this.repository.update(sucursal_id, { caja_chica: total });
  }
}
