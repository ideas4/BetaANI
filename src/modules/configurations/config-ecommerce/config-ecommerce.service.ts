import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/modules/stores/entities/store.entity';
import { Repository } from 'typeorm';
import { Config } from '../config-admin/entities/config.entity';
import { BannerInfoEcommerceDto } from './dto/banner-info.dto';
import { ColorsEcommerceDto } from './dto/colores-info.dto';
import { CreateConfigEcommerceDto } from './dto/create-config-ecommerce.dto';
import { EmailMessageAccountDto } from './dto/email-message-account.dto';
import { EmailMessageOrderDto } from './dto/email-message-order.dto';
import { FooterInfoEcommerceDto } from './dto/footer-info.dto';
import { HomeInfoEcommerceDto } from './dto/home-info.dto';
import { InfoEcommerceDto } from './dto/info.dto';
import { ConfigEcommerce } from './entities/config-ecommerce.entity';
import { FeaturedCategory } from './entities/featured-categories.entity';
import { CreateFeatCategoryDto } from './dto/create-feat-category.dto';
import { UpdateFeatCategoryDto } from './dto/update-feat-category.dto';
import { transforPropToString } from '../../../constants';
import { Product } from '../../products/entities/product.entity';
import { PromoDto } from './dto/promo.dto';

@Injectable()
export class ConfigEcommerceService {

  constructor(@InjectRepository(ConfigEcommerce) private repository:Repository<ConfigEcommerce>,
              @InjectRepository(Store) private repositoryStore:Repository<Store>,
              @InjectRepository(Product) private repositoryProducts:Repository<Product>,
              @InjectRepository(FeaturedCategory) private repositoryCategoriesFeat:Repository<FeaturedCategory>,
              @InjectRepository(Config) private repositoryInfo:Repository<Config>){}


              async findOne(){
    return this.repository.findOne(1);
              }

  async create(createConfigEcommerceDto: CreateConfigEcommerceDto) {
    const value = await this.repository.count();
    if(value > 0){
      throw new HttpException('Ya existe una configuración de tienda creada',HttpStatus.CONFLICT);
    }
    //asignar primera sucursal por defecto 
   /* if(await this.repositoryStore.count() > 0){
      createConfigEcommerceDto.sucursal = await this.repositoryStore.findOne({order:{id:'ASC'}});
      console.log(createConfigEcommerceDto.sucursal)
    }*/
   return this.repository.save(createConfigEcommerceDto);
  }

  /**
   * Obtiene la información del inicio del e-commerce
   */
  async findHome() {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
   return this.repository.findOne(1,{select:['titulo_inicio','descripcion_inicio','subtitulo_inicio','imagen_inicio','texto_boton_inicio']});
  }

   /**
   * Obtiene la información del inicio del e-commerce
   */
  async findInfo() {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
   return this.repository.findOne(1,{select:['nombre','direccion','telefono','correo_electronico','logo','terminos_condiciones','favicon']});
  }

  /**
   * Obtiene la URL del logo
   */
  async getLogo() {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
    return this.repository.findOne(1,{select:['logo']});
  }

  /**
   * Obtiene la información del footer del e-commerce
   */
  async findFooter() {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
    return await this.repository.findOne(1,{select:['nombre','titulo_footer','descripcion_footer','direccion','telefono',
    'correo_electronico','logo','nombre','favicon']});
  }

  /**
   * Obtiene los términos y condiciones de compra
   */
  async findTerminos() {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
    return await this.repository.findOne(1,{select:['terminos_condiciones']});
  }

  /**
   * Obtiene los colores del e-commerce
   */
  async findColors() {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
   return this.repository.findOne(1,{select:[
     'primaryColor','primaryLightColor','primaryDarkColor','PrimaryTextColor',
     'secondaryColor','secondaryDarkColor','secondaryTextColor'
    ]});
  }

  /**
   * Obtiene la promoción del mes del e-commerce
   */
  async findPromo() {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
   return await this.repository.findOne(1,{select:['promocionMes']})
  }

    /**
   * Obtiene la información del banner de promocion del e-commerce
   */
  async findBanner() {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
   return this.repository.findOne(1,{select:['imagen_banner','titulo_banner','subtitulo_banner','descripcion_banner','texto_boton_banner']});
  }


   /**
   * Actualiza la información del inicio del e-commerce
   */
  async updateHome(update:HomeInfoEcommerceDto) {
    if(await this.repository.count() > 0){
      await this.repository.update(1,update);
    }else{
      await this.repository.save(update);
    }
    return 'Ok';
  }

   /**
   * Actualiza la información del inicio del e-commerce
   */
  async updateInfo(update:InfoEcommerceDto) {
    if(await this.repository.count() > 0){
      await this.repository.update(1,update);
    }else{
      await this.repository.save(update);
    }  
    return 'Ok';
  }

  /**
   * Actualiza la información del footer del e-commerce
   */
  async updateFooter(update:FooterInfoEcommerceDto) {
    if(await this.repository.count() > 0){
      await this.repository.update(1,update);
    }  else{
      await this.repository.save(update);
    }  
    return 'Ok';
  }

  /**
   * Actualiza los colores del e-commerce
   */
  async updateColors(update:ColorsEcommerceDto) {
    if(await this.repository.count() > 0){
      await this.repository.update(1,update);
    }  else{
      await this.repository.save(update);
    }  
    return 'Ok';
  }

  /**
   * Actualiza la promoción del mes del e-commerce
   */
  async updatePromo(body:PromoDto) {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
    return await this.repository.update(1,{promocionMes:body.url})
  }

    /**
   * Actualiza la información del banner de promocion del e-commerce
   */
  async updateBanner(update:BannerInfoEcommerceDto) {
    if(await this.repository.count() > 0){
      await this.repository.update(1, update);
    }  else{
      await this.repository.save(update);
    }  
    return 'Ok';
  }

  /**
   * Obtiene la información del mensaje de confirmación de cuenta
   */
  async findWelcomeMessage() {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
   return this.repository.findOne(1,{select:['mensaje_bienvenida','banner_bienvenida']});
  }

    /**
   * Actualiza la información del mensaje de confirmación de cuenta
   */
  async updateWelcomeMessage(update:EmailMessageAccountDto) {
    if(await this.repository.count() > 0){
      await this.repository.update(1, update);
    }  else{
      await this.repository.save(update);
    }  
    return 'Ok';
  }

   /**
   * Obtiene la información del mensaje de orden
   */
  async findOrderMessage() {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
   return this.repository.findOne(1,{select:['mensaje_orden','banner_orden']});
  }

    /**
   * Actualiza la información del mensaje de orden
   */
  async updateOrderMessage(update:EmailMessageOrderDto) {
    if(await this.repository.count() > 0){
      await this.repository.update(1, update);
    }  else{
      await this.repository.save(update);
    }  
    return 'Ok';
  }


  /**
   * Obtiene las categorias destacadas
   */
  async findCategories() {
    const value =await this.repository.count();
    if(value == 0){
      throw new HttpException('No existe una configuración de tienda creada',HttpStatus.NOT_FOUND);
    }
    let categories = await this.repositoryCategoriesFeat.find({relations:['categoria']});
    categories.forEach(value1 => {
      value1['categoria_id'] = value1.categoria.id
    })
    transforPropToString(categories,'categoria',['nombre'])
    return categories
  }

  /**
   * Obtiene las categorias destacadas
   */
  async findCategory(id:string) {
   let val = await this.repositoryCategoriesFeat.findOne(id,{relations:['categoria']});
   if(!val){
      throw  new HttpException('La categoria no es destacada', HttpStatus.NOT_FOUND)
   }
   return val
  }

  /**
   * Agrega una categoria destacada
   */
  async addCategory(createFeatCategory:CreateFeatCategoryDto) {
   if(await this.repositoryCategoriesFeat.count({where:{categoria:{id:createFeatCategory.categoria }}})==0){
     return this.repositoryCategoriesFeat.save(createFeatCategory);
   }
   throw new HttpException('La categoría ya es destacada',HttpStatus.CONFLICT)
  }

  /**
   * Edita una categoria destacada
   */
  async updateCategory(id:string,update:UpdateFeatCategoryDto) {
    return (await this.repositoryCategoriesFeat.update(id,update)).affected>0?'Ok':'Not OK';
  }

  /**
   * Elimina una categoria destacada
   */
  async deleteCategory(id:string) {
    return this.repositoryCategoriesFeat.delete(id);
  }


  /**
   * Marca un producto como destacado
   */
  async addFeaturedProduct(id:string) {
    const count = await this.repositoryProducts.count({where:{destacado:true}});
    if(count < 4){
      await this.repositoryProducts.update(id,{destacado:true})
      return 'Ok';
    }else{
      throw  new HttpException('Solo deben existir cuatro productos destacados',HttpStatus.CONFLICT);
    }
  }

  /**
   * Elimina un producto como destacado
   */
  async deleteFeaturedProduct(id:string) {
    await this.repositoryProducts.update(id,{destacado:false})
    return 'Ok';
  }

}
