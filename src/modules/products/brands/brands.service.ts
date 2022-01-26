import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {

  constructor(@InjectRepository(Brand) private repository:Repository<Brand>){}

  async create(createBrandDto: CreateBrandDto) {
   if(!await this.repository.findOne({nombre:createBrandDto.nombre})){
      return this.repository.save(createBrandDto);
   }else{
     throw new HttpException('La marca ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const inst = await this.repository.findOne({nombre:updateBrandDto.nombre});
    if(!inst || inst.id == id){
      return (await this.repository.update(id,updateBrandDto)).affected;
    }else{
     throw new HttpException('La marca ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  async remove(id: number) {
    return (await this.repository.delete(id)).affected;
  }

  findtoFill(){
    return this.repository.find();
  }
}
