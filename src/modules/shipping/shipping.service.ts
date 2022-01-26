import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '../products/brands/entities/brand.entity';
import { Repository } from 'typeorm';
import { Shipping } from './entities/shipping.entity';

@Injectable()
export class ShippingService {

  constructor(@InjectRepository(Shipping) private repository:Repository<Shipping>) {
  }

  /**
   * Crea un nuevo costo de envio
   * @param createShippingDto
   */
  async create(createShippingDto: CreateShippingDto) {
    if((await this.repository.count({where:{nombre:createShippingDto.nombre}})) > 0){
      throw new HttpException('Ya existe el costo de envío',HttpStatus.BAD_REQUEST);

    }
    return this.repository.save(createShippingDto);
  }

  /**
   * Obtiene lista de costos de envio
   */
  findAll() {
    return this.repository.find();
  }

  /**
   * Obtiene costo de envío segun id
   * @param id de costo de envio
   */
  findOne(id: number) {
    return this.repository.findOne(id);
  }

  /**
   * Actualizar costo de envio
   * @param id
   * @param updateShippingDto
   */
  async update(id: number, updateShippingDto: UpdateShippingDto) {
    return (await this.repository.update(id,updateShippingDto)).affected;
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
