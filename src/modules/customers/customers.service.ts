import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private repository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    if (
      !(await this.repository.findOne({
        nombre_completo: createCustomerDto.nombre_completo,
      }))
    ) {
      createCustomerDto['fecha_creacion'] = new Date();
      return this.repository.save(createCustomerDto);
    } else {
      throw new HttpException(
        'El Cliente ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const inst = await this.repository.findOne({
      nombre_completo: updateCustomerDto.nombre_completo,
    });
    if (!inst || inst.id == id) {
      return (await this.repository.update(id, updateCustomerDto)).affected;
    } else {
      throw new HttpException(
        'El cliente ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async remove(id: number) {
    return (await this.repository.delete(id)).affected;
  }

  findAllClient() {
    let query =
      'SELECT * FROM cliente LEFT OUTER JOIN cliente_hojaprecio ON cliente.id = cliente_hojaprecio.clienteId;';
    return this.repository.query(query);
  }
}
