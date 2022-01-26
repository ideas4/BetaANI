import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';

@Injectable()
export class ColorsService {

  constructor(@InjectRepository(Color) private repository:Repository<Color>){}

  async create(createBrandDto: CreateColorDto) {
   if(!await this.repository.findOne({nombre:createBrandDto.nombre})){
      return this.repository.save(createBrandDto);
   }else{
     throw new HttpException('El color ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.find({id});
  }

  async update(id: number, updateBrandDto: UpdateColorDto) {
    if(!await this.repository.findOne({nombre:updateBrandDto.nombre})){
      return (await this.repository.update(id,updateBrandDto)).affected;
    }else{
     throw new HttpException('El color ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  async remove(id: number) {
    return (await this.repository.delete(id)).affected;
  }

  findtoFill(){
    return this.repository.find();
  }
}
