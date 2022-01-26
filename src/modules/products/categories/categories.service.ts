import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {

  constructor(@InjectRepository(Category)  private repository: Repository<Category>){}

  /**
   * Crear categoria
   * @param createCategoryDto 
   */
  async create(createCategoryDto: CreateCategoryDto) {
    if(!await this.repository.findOne({nombre:createCategoryDto.nombre})){
      createCategoryDto.nombre = createCategoryDto.nombre.toUpperCase();
      return this.repository.save(createCategoryDto);
    }else{
     throw new HttpException('La categoría ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  /**
   * Obtener lista con toda la información de las categorias
   */
  findAll() {
    return this.repository.find();
  }

  /**
   * Mostrar información de una categoria para editar
   * @param id de categoria
   */
  findOne(id: number) {
    return this.repository.findOne(id);
  }

  /**
   * Editar categoria
   * @param id de categoria
   * @param updateCategoryDto 
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const inst = await this.repository.findOne({nombre:updateCategoryDto.nombre});
    if(!inst || inst.id == id){
      return (await this.repository.update(id,updateCategoryDto)).affected;
    }else{
     throw new HttpException('La categoría ya existe',HttpStatus.NOT_ACCEPTABLE);
   }
  }

  /**
   * Eliminar categoria
   * @param id de categoria
   */
  async remove(id: number) {
    try {
      return (await this.repository.delete(id)).affected;
    }catch (e) {
      throw new HttpException('No se ha podido eliminar la categoria', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * Obtener una lista de id-nombre de categorias
   */
  async findtoFill(){
    const fill = await this.repository.createQueryBuilder('obj')
    .select(["obj.id","obj.nombre"])
    .getMany();
    return fill;
  }
}
