import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import { Spec } from './entities/spec.entity';

@Injectable()
export class SpecsService {

  constructor(@InjectRepository(Spec) private repository:Repository<Spec>){}

  /**
   * Crea una especificación para productos
   * @param createSpecDto 
   */
  async create(createSpecDto: CreateSpecDto) {
    if(!await this.repository.findOne({nombre:createSpecDto.nombre})){
      return this.repository.save(createSpecDto);
    }else{
     throw new HttpException('La especificación ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  /**
   * Retornar lista de especificaciones
   */
  findAll() {
    return this.repository.find();
  }

  /**
   * Retornar información de especificación para editar 
   * @param id de especificación
   */
  findOne(id: number) {
    return this.repository.findOne(id);
  }

  /**
   * Modificar una especificación
   * @param id de especificacion
   * @param updateSpecDto 
   */
  async update(id: number, updateSpecDto: UpdateSpecDto) {
    const inst = await this.repository.findOne({nombre:updateSpecDto.nombre});
    if(!inst || inst.id == id){
      return (await this.repository.update(id,updateSpecDto)).affected;
    }else{
     throw new HttpException('La especificación ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  /**
   * Eliminar una especificación
   * @param id de especificación
   */
  async remove(id: number) {
    return (await this.repository.delete(id)).affected;
  }

   /**
   * Obtener una lista de id-nombre de las especificaciones
   */
  async findtoFill(){
    const fill = await this.repository.createQueryBuilder('obj')
    .select(["obj.id","obj.nombre"])
    .getMany();
    return fill;
  }
}
