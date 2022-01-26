import { Injectable } from '@nestjs/common';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditCard } from './entities/credit-card.entity';
import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Injectable()
export class CreditCardsService {

  constructor(@InjectRepository(CreditCard) private repository:Repository<CreditCard>) {
  }

  /**
   * Crear registro de tarjeta de credito
   * @param createCreditCardDto
   */
  create(createCreditCardDto: CreateCreditCardDto) {
    createCreditCardDto.fecha = new Date();
    return this.repository.save(createCreditCardDto);
  }

  /**
   * Asignar orden a registro de tarjeta
   * @param id_card
   * @param order
   */
  setOrder(id_card:string,order:Order){
    return this.repository.update(id_card,{orden:order})
  }

  /**
   * Obtener lista de regisstros de tarjeta de credito
   */
  async findAll() {
    let result:any[] = await this.repository.find({relations:['orden']});
    result.forEach(value => {
      value.orden = value.orden?value.orden.id:0
    })
    return result
  }

  findOne(id: number) {
    return `This action returns a #${id} creditCard`;
  }

  update(id: number, updateCreditCardDto: UpdateCreditCardDto) {
    return `This action updates a #${id} creditCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} creditCard`;
  }
}
