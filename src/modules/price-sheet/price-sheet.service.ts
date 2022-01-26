import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePriceSheetDto } from './dto/create-price-sheet.dto';
import { UpdatePriceSheetDto } from './dto/update-price-sheet.dto';
import { PriceSheet } from './entities/price-sheet.entity';

@Injectable()
export class PriceSheetService {
  constructor(
    @InjectRepository(PriceSheet)
    private priceSheetRepository: Repository<PriceSheet>,
  ) {}

  async create(dto: CreatePriceSheetDto) {
    if (!(await this.priceSheetRepository.findOne({ id: dto.id }))) {
      dto['fecha_creacion'] = new Date();
      dto['fecha_modificacion'] = new Date();
      return this.priceSheetRepository.save(dto);
    } else {
      throw new HttpException(
        'La hoja de precios ya existe.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  findAll() {
    return this.priceSheetRepository.find();
  }

  async update(id: number, updatePriceSheetDto: UpdatePriceSheetDto) {
    updatePriceSheetDto['fecha_modificacion'] = new Date();
    return (await this.priceSheetRepository.update(id, updatePriceSheetDto))
      .affected;
  }

  findOne(id: number) {
    return this.priceSheetRepository.findOne(id);
  }

  findAllClient() {
    let query =
      'SELECT * FROM cliente LEFT OUTER JOIN cliente_hojaprecio ON cliente.id = cliente_hojaprecio.clienteId;';
    return this.priceSheetRepository.query(query);
  }

  async remove(id: number) {
    return (await this.priceSheetRepository.delete(id)).affected;
  }

  findAllProducts(id: number, idSucursal: number) {
    const query = `select p.id, p.nombre, p.sku, d.precio, s.nombre as nombre_s, prov.nombre as nombre_prov
    from producto as p
    inner join detalle_hp as d ON p.id = d.articuloId
    inner join inventario as i on p.id = i.producto_id
    inner join sucursal as s on i.sucursal_id = s.id
    inner join proveedor as prov on p.proveedor_id = prov.id
    WHERE p.bos = 'b' AND d.hojaId = ${id} AND d.estado = 1 AND i.sucursal_id = ${idSucursal} AND i.cantidad > 0
    
    UNION ALL
    
    select p.id, p.nombre, p.sku, d.precio, '' as nombre_s,  case isnull(prov.nombre) when 1 then '' else prov.nombre end as nombre_prov
    from producto as p
    inner join detalle_hp as d ON p.id = d.articuloId
    left outer join proveedor as prov on p.proveedor_id = prov.id
    WHERE p.bos = 's' AND d.hojaId = ${id} AND d.estado = 1;`;
    return this.priceSheetRepository.query(query);
  }
}
