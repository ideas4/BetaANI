import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transforPropToString } from 'src/constants';
import { Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponType } from './entities/coupon-value-type.entity';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {

  constructor(@InjectRepository(Coupon) private repository:Repository<Coupon>,
  @InjectRepository(CouponType) private repositoryType:Repository<CouponType>){}

  async create(createCouponDto: CreateCouponDto) {
    if ( !(await this.repository.findOne({ nombre: createCouponDto.nombre}))) {
      createCouponDto['fecha_creacion'] = new Date();
      return this.repository.save(createCouponDto);
    } else {
      throw new HttpException(
        'El Cupón ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async findAll() {
    let result = await this.repository.createQueryBuilder('cp')
    .leftJoinAndSelect('cp.tipo_cupon','tipo')
    .getMany();

    transforPropToString(result,'tipo_cupon',['nombre'])
    return result;
  }

  findOne(id: number) {
    return this.repository.findOne({id});
  }

  findTypes(){
    return this.repositoryType.find();
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    if ( !(await this.repository.findOne({ nombre: updateCouponDto.nombre}))) {
      return this.repository.update(id,updateCouponDto);
    } else {
      throw new HttpException(
        'El Cupón ya existe',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async remove(id: number) {
    return (await this.repository.delete(id)).affected;
  }
}
