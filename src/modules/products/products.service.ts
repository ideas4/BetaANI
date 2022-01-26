import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transforPropToString } from 'src/constants';
import { CategoriesService } from 'src/modules/products/categories/categories.service';
import { SpecProduct } from 'src/modules/products/specs/entities/spec-product.entity';
import { Spec } from 'src/modules/products/specs/entities/spec.entity';
import { SpecsService } from 'src/modules/products/specs/specs.service';
import { Connection, In, Repository } from 'typeorm';
import { CreateProductDto } from '../inventory/dto/create-product.dto';
import { FilterProductDto } from '../inventory/dto/filter-product.dto';
import { InfoProductsResponseDto } from '../inventory/dto/info-products-response.dto';
import { InfoProductsDto } from '../inventory/dto/info-products.dto';
import { ProductShopDto } from '../inventory/dto/product-shop.dto';
import { UpdateProductDto } from '../inventory/dto/update-product.dto';
import { ImageProduct } from './entities/img-product.entity';
import { Product } from './entities/product.entity';
import { InventoryService } from '../inventory/services/inventory/inventory.service';
import { LogInventoryService } from '../inventory/services/log-inventory/log-inventory.service';
import { RelationProducts } from './entities/relation-products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repository: Repository<Product>,
    @InjectRepository(RelationProducts)
    private repositoryrelationProducts: Repository<RelationProducts>,
    @InjectRepository(ImageProduct)
    private repositoryImgs: Repository<ImageProduct>,
    @InjectRepository(SpecProduct)
    private repositorySpecs: Repository<SpecProduct>,
    private inventoryService: InventoryService,
    private logInventoryService: LogInventoryService,
    private categoryService: CategoriesService,
    private specService: SpecsService,
    private connection: Connection,
  ) {}

  /**
   * Crear un producto
   * @param createProductDto
   */
  async create(createProductDto: CreateProductDto) {
    //iniciando transaccion
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    createProductDto.nombre = createProductDto.nombre.toUpperCase();
    createProductDto.sku = createProductDto.sku.toUpperCase();
    try {
      if (!(await this.repository.findOne({ sku: createProductDto.sku }))) {
        createProductDto['fecha_creacion'] = new Date();
        createProductDto['categorias'] = [];
        const cat = await this.categoryService.findOne(
          +createProductDto.categoria,
        );
        if (cat) {
          createProductDto['categorias'] = [cat];
        }
        const product = await this.repository.save(createProductDto);
        //ingresando a inventario
        const inv = await this.inventoryService.newInventory({
          cantidad: createProductDto.cantidad,
          producto: product.id,
          sucursal: createProductDto.sucursal,
        });
        //ingresando a log
        await this.logInventoryService.addLog({
          cantidad_actual: createProductDto.cantidad,
          cantidad_anterior: 0,
          notas: '',
          fecha: new Date(),
          inventario: inv.id,
          usuario: 1,
          descripcion: 'Agregando producto a Inventario',
        });
        return product;
      } else {
        throw new HttpException('El SKU ya existe', HttpStatus.NOT_ACCEPTABLE);
      }
    } catch (ex) {
      console.log(ex);
      if (ex instanceof HttpException) {
        throw new HttpException(ex.message, ex.getStatus());
      }
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Mostrar lista de todos los productos
   */
  async findAll() {
    const result = await this.repository
      .createQueryBuilder('prod')
      .select([
        'prod.id',
        'prod.sku',
        'prod.nombre',
        'prod.showInStore',
        'prod.precio_original',
        'prod.precio_venta',

        'prod.bos',
        'prod.ultimo_costo',
        'prod.costo_promedio',
        'prod.precio_min',
        'prod.fabricante',
        'prod.division',
        'prod.sub_division',
        'prod.material',
        'prod.medida',
        'prod.capacidad',
        'prod.embalaje',
        'prod.USERDEF_1',
        'prod.USERDEF_2',
        'prod.USERDEF_3',
        'prod.USERDEF_4',

        'brand.nombre',
        'supplier.nombre',
      ])
      .innerJoin('prod.marca', 'brand')
      .innerJoin('prod.proveedor', 'supplier')
      .leftJoinAndMapOne(
        'prod.imagen',
        'prod.imagenes',
        'imagen',
        'imagen.prioridad = 1',
      )
      .where('prod.isDeleted is false')
      .orderBy('prod.id')
      .getMany();
    transforPropToString(result, 'imagen', ['url']);
    transforPropToString(result, 'marca', ['nombre']);
    transforPropToString(result, 'proveedor', ['nombre']);
    return result;
  }

  /**
   * Mostrar info de producto para editar
   * @param id de producto
   */
  async findOne(id: number) {
    const result = await this.repository
      .createQueryBuilder('prod')
      .select([
        'prod.id',
        'prod.sku',
        'prod.nombre',
        'prod.descripcion',
        'prod.precio_original',
        'prod.precio_venta',
        'prod.bos',
        'prod.ultimo_costo',
        'prod.precio_min',
        'prod.costo_promedio',
        'prod.fabricante',
        'prod.division',
        'prod.sub_division',
        'prod.material',
        'prod.medida',
        'prod.capacidad',
        'prod.embalaje',
        'prod.USERDEF_1',
        'prod.USERDEF_2',
        'prod.USERDEF_3',
        'prod.USERDEF_4',
        'brand.id',
        'supplier.id',
      ])
      .innerJoin('prod.marca', 'brand')
      .innerJoin('prod.proveedor', 'supplier')
      .where('prod.id = :id', { id })
      .getOne();
    transforPropToString(result, 'marca', ['id']);
    transforPropToString(result, 'proveedor', ['id']);
    return result;
  }

  /**
   * Obtener el detalle de un producto
   * @param id del producto
   */
  async findDetail(id: number) {
    const result = await this.repository
      .createQueryBuilder('prod')
      .select([
        'prod.id',
        'prod.sku',
        'prod.nombre',
        'prod.fecha_creacion',
        'prod.descripcion',
        'prod.precio_original',
        'prod.precio_venta',
        'prod.bos',
        'prod.ultimo_costo',
        'prod.costo_promedio',
        'prod.fabricante',
        'prod.division',
        'prod.sub_division',
        'prod.material',
        'prod.medida',
        'prod.capacidad',
        'prod.embalaje',
        'prod.USERDEF_1',
        'prod.USERDEF_2',
        'prod.USERDEF_3',
        'prod.USERDEF_4',
        'brand.nombre',
        'supplier.nombre',
      ])
      .leftJoin('prod.marca', 'brand')
      .leftJoin('prod.proveedor', 'supplier')
      .leftJoinAndSelect('prod.categorias', 'categorias')
      .leftJoinAndSelect('prod.color', 'color')
      .leftJoinAndSelect('prod.imagenes', 'imagenes')
      .leftJoinAndSelect('prod.especificaciones', 'specsp')
      .leftJoinAndSelect('specsp.especificacion', 'spec')
      .where('prod.id = :id', { id })
      .getOne();
    transforPropToString(result, 'color', ['nombre']);
    result.especificaciones.forEach((element) => {
      element['nombre'] = element.especificacion
        ? element.especificacion.nombre
        : null;
      element['id'] = element.especificacion ? element.especificacion.id : null;
      delete element.especificacion;
    });

    const products = await this.inventoryService.getInventoryByProduct(
      result.id,
    );
    result['productos'] = products;
    transforPropToString(result, 'marca', ['nombre']);
    transforPropToString(result, 'proveedor', ['nombre']);
    return result;
  }

  /**
   * Obtener los productos relacionados
   * @param id
   */
  async getRelation(id: string) {
    return this.repositoryrelationProducts.find({
      where: { id_principal: id },
      relations: [
        'id_relacionado',
        'id_relacionado.marca',
        'id_relacionado.proveedor',
        'id_principal',
      ],
    });
  }

  /**
   * Actualizar la información básica de un producto
   * @param id de producto
   * @param updateProductDto
   */
  async update(id: number, updateProductDto: UpdateProductDto) {
    const prod = await this.repository.findOne({
      sku: updateProductDto.sku,
      id,
    });
    if (prod) {
      return (await this.repository.update(id, updateProductDto)).affected;
    } else {
      throw new HttpException('El SKU ya existe', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  /**
   * Actualizar la información básica de un producto
   * @param principal
   * @param rel
   */
  async relation(principal: any, rel: any) {
    if (principal == rel) {
      throw new HttpException(
        'El producto no se puede relacionar con si mismo',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (
      (await this.repositoryrelationProducts.count({
        where: {
          id_principal: principal,
          id_relacionado: rel,
        },
      })) > 0
    ) {
      throw new HttpException(
        'El producto ya está relacionado',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return await this.repositoryrelationProducts.save({
      id_principal: principal,
      id_relacionado: rel,
    });
  }

  /**
   * Actualizar la información básica de un producto
   * @param id
   */
  async deleteRelation(id: string) {
    console.log(id);
    if (
      (await this.repositoryrelationProducts.count({
        where: {
          id: id,
        },
      })) < 0
    ) {
      throw new HttpException(
        'El producto no está relacionado',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return (await this.repositoryrelationProducts.delete(id)).affected;
  }

  /**
   * Eliminar un producto
   * @param id de producto
   */
  async remove(id: number) {
    const queryInventario = await this.repository.query(
      `select inventario.id from inventario where producto_id = ${id} AND inventario.cantidad > 0;`,
    );

    const queryHP = await this.repository.query(
      `select detalle_hp.hojaId from detalle_hp where articuloId = ${id};`,
    );

    const queryFactura = await this.repository.query(
      `select detalle_factura.tipo, detalle_factura.numero, detalle_factura.serie from detalle_factura
      inner join producto p on detalle_factura.codigo_articulo = p.sku
      where p.id = ${id};`,
    );

    const queryImgProd = await this.repository.query(
      `select producto_id from especificacion_producto where producto_id = ${id}
      union all
      select id from producto_relacionado where id = ${id}
      union all
      select id from imagen_producto where producto_id = ${id};`,
    );

    //let find = false;
    console.log(queryInventario);
    console.log('');
    console.log(queryHP);
    console.log('');
    console.log(queryFactura);
    console.log('');
    console.log(queryImgProd);

    //inventario !=0, cantidad 0 delete true ... EL PRODUCTO NO SE PUEDE ELIMINAR POR QUE CUENTA CON EXISTENCIA EN INVENTARIO. PARA ELIMINARLO DEBE DESCARGAR LA EXISTENCIA DEL INVENTARIO.
    //hp, cambiar estado a 0 el producto
    //ImgProd, eliminar imagen para que isDelete true

    if (queryInventario.length == 0) {
      if (queryImgProd.length == 0) {
        //ACTUALIZAR ESTADO EN HOJA DE PRECIO
        if (queryHP.length != 0) {
          let queryStateHp = `update detalle_hp
                              set estado = 0 where articuloId = ${id}`;
          await this.repository.query(queryStateHp);
        }

        //ACTUALIZAR ESTADO EN PRODUCTO
        return await this.repository.update(id, { isDeleted: true, sku: '' });
      } else {
        throw new HttpException(
          'EL PRODUCTO NO SE PUEDE ELIMINAR POR QUE HAY UNA IMAGEN QUE TIENE ESTE PRODUCTO.' +
            'PARA ELIMINAR EL PRODUCTO DEBE ELIMINAR LA IMAGEN.',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    } else {
      throw new HttpException(
        'EL PRODUCTO NO SE PUEDE ELIMINAR POR QUE CUENTA CON EXISTENCIA EN INVENTARIO.' +
          'PARA ELIMINARLO DEBE DESCARGAR LA EXISTENCIA DEL INVENTARIO.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    // if (
    //   queryInventario.length != 0 ||
    //   queryHP.length != 0 ||
    //   queryImgProd != 0
    // ) {
    //   //find = true;
    //   throw new HttpException(
    //     'El producto no se puede eliminar.',
    //     HttpStatus.NOT_ACCEPTABLE,
    //   );
    // } else {
    //   return (await this.repository.update(id, { isDeleted: true, sku: '' }))
    //     .affected;
    // }

    // return (await this.repository.update(id, { isDeleted: true, sku: '' }))
    //   .affected;
  }

  /**
   * Obtener info para llenar selects y combobox
   */
  async findtoFill(isUnique: boolean) {
    let result = [];
    if (isUnique) {
      // fill producto unico
      result = await this.repository
        .createQueryBuilder('prod')
        .select(['prod.id', 'prod.sku', 'prod.nombre'])
        .orderBy('prod.id')
        .where('prod.isDeleted is false')
        .getMany();
    } else {
      // fill producto por proveedor por sucursal
      result = await this.repository
        .createQueryBuilder('prod')
        .select([
          'prod.id',
          'prod.sku',
          'prod.nombre',
          'brand.nombre',
          'supplier.nombre',
        ])
        .innerJoin('prod.marca', 'brand')
        .innerJoin('prod.proveedor', 'supplier')
        .orderBy('prod.id')
        .getMany();
      transforPropToString(result, 'marca', ['nombre']);
      transforPropToString(result, 'proveedor', ['nombre']);
    }
    return result;
  }

  /**
   * Asociar Imagen con Producto
   * @param filename imagen
   * @param id del producto
   */
  async addImage(filename, id) {
    const count = await this.repositoryImgs.count({ where: { producto: id } });
    if (count < 4) {
      return this.repositoryImgs.save({
        url: 'products/' + filename,
        producto: id,
        prioridad: count == 0 ? 1 : 2,
      });
    } else {
      throw new HttpException(
        'El producto ya tiene el máximo de cuatro imagenes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Eliminar una imagen de producto
   * @param id de la relacion-imagen/producto
   */
  async deleteImage(id: number) {
    return (await this.repositoryImgs.delete(id)).affected;
  }

  /**
   * Actualizar la prioridad de las imagenes de un producto
   * @param id_producto
   * @param id_imagen
   */
  async updateImagePriority(id_producto: number, id_imagen: number) {
    //asignar prioridad 2 a todas las imagenes
    await this.repositoryImgs.update(
      { producto: { id: id_producto } },
      { prioridad: 2 },
    );
    //asignar prioridad 1 a la imagen
    await this.repositoryImgs.update(id_imagen, { prioridad: 1 });
    return 'ok';
  }

  /**
   * Agregar categoria a un producto
   * @param id_product
   * @param id_category
   */
  async addCategoryToProduct(id_product: number, id_category: number) {
    const product: Product = await this.repository.findOne(id_product, {
      relations: ['categorias'],
    });
    const cat = await this.categoryService.findOne(id_category);
    product.categorias.push(cat);
    await product.save();
    return 'OK';
  }

  /**
   * Eliminar la categoria de un producto
   * @param id_product
   * @param id_category
   */
  async deleteCategoryProduct(id_product: number, id_category: number) {
    const product: Product = await this.repository.findOne(id_product, {
      relations: ['categorias'],
    });
    const index = product.categorias.findIndex(
      (element) => element.id == id_category,
    );
    if (index > -1) {
      product.categorias.splice(index, 1);
      await product.save();
      return 'OK';
    }
    return 'not OK';
  }

  /**
   * Agregar especificacion a un producto
   * @param id_product
   * @param id_spec
   * @param valor
   */
  async addSpecToProduct(id_product: number, id_spec: number, valor: string) {
    const product: Product = await this.repository.findOne(id_product, {
      relations: ['especificaciones'],
    });
    const spec: Spec = await this.specService.findOne(id_spec);
    await this.repositorySpecs.save({
      especificacion: spec,
      producto: product,
      valor,
    });
    return 'OK';
  }

  /**
   * Eliminar la especificacion de un producto
   * @param id_product
   * @param id_spec
   */
  async deleteSpecProduct(id_product: number, id_spec: number) {
    const deleteResultPromise = await this.repositorySpecs.delete({
      producto: { id: id_product },
      especificacion: { id: id_spec },
    });
    return deleteResultPromise.affected;
  }

  /**
   * Obtener lista de productos para la tienda
   * Aplicación de filtros
   * @param filters
   */
  async findToShopping(filters: FilterProductDto): Promise<ProductShopDto[]> {
    const query = this.repository
      .createQueryBuilder('prod')
      .leftJoinAndSelect('prod.imagenes', 'imagenes')
      .leftJoinAndSelect('prod.inventario', 'inventario')
      .leftJoinAndSelect('prod.categorias', 'categorias')
      .where('prod.showInStore is true')
      .andWhere('prod.isDeleted is false');
    //filtro de marca
    if (filters.brand) {
      query.andWhere('prod.marca.id = :brand', { brand: filters.brand });
    }
    //filtro de color
    if (filters.color) {
      query.andWhere('prod.color.id = :color', { color: filters.color });
    }
    //filtro de precio
    if (filters.priceStart) {
      query.andWhere('prod.precio_venta >= :precios', {
        precios: filters.priceStart,
      });
    }
    if (filters.priceStart) {
      query.andWhere('prod.precio_venta <= :preciof', {
        preciof: filters.priceEnd,
      });
    }
    //size
    if (filters.size) {
      query.limit(filters.size);
    }
    //sort
    if (filters.sort) {
      if (filters.sort == 1) {
        query.orderBy({
          'prod.precio_venta': 'ASC',
          'imagenes.prioridad': 'ASC',
        });
      } else {
        query.orderBy({
          'prod.precio_venta': 'DESC',
          'imagenes.prioridad': 'ASC',
        });
      }
    }
    const result = await query.getMany();

    const products: ProductShopDto[] = [];
    result.forEach((element) => {
      //filtro de categoria
      if (
        !filters.cat ||
        element.categorias.findIndex((element) => element.id == filters.cat) !=
          -1
      ) {
        if (element.inventario.length > 0) {
          element.inventario.forEach((invItem) => {
            if (
              invItem.cantidad > 0 &&
              !products.find((value) => value.id == element.id)
            ) {
              //ordenar prioridades
              element.imagenes = element.imagenes.sort(
                (a, b) => a.prioridad - b.prioridad,
              );
              products.push({
                id: element.id,
                nombre: element.nombre,
                imagen:
                  element.imagenes.length > 0 ? element.imagenes[0].url : '',
                precio: element.precio_venta,
              });
              return;
            }
          });
        }
      }
    });
    return products;
  }

  /**
   * Obtener los productos relacionados para e-commerce
   * @param id_product
   */
  async getRelationtoShop(id_product: string) {
    const result: RelationProducts[] = await this.repositoryrelationProducts.find(
      {
        where: {
          id_principal: { id: id_product, showInStore: true, isDeleted: false },
        },
        relations: [
          'id_relacionado',
          'id_relacionado.imagenes',
          'id_relacionado.inventario',
          'id_relacionado.categorias',
        ],
      },
    );
    const products: ProductShopDto[] = [];
    result.forEach((element) => {
      //filtro de categoria
      if (element.id_relacionado.inventario.length > 0) {
        element.id_relacionado.inventario.forEach((invItem) => {
          if (
            invItem.cantidad > 0 &&
            !products.find((value) => value.id == element.id)
          ) {
            //ordenar prioridades
            element.id_relacionado.imagenes = element.id_relacionado.imagenes.sort(
              (a, b) => a.prioridad - b.prioridad,
            );
            products.push({
              id: element.id,
              nombre: element.id_relacionado.nombre,
              imagen:
                element.id_relacionado.imagenes.length > 0
                  ? element.id_relacionado.imagenes[0].url
                  : '',
              precio: element.id_relacionado.precio_venta,
            });
            return;
          }
        });
      }
    });
    return products;
  }

  /**
   * Obtener lista de productos destacados
   * @param filters
   */
  async findToFeatured(): Promise<ProductShopDto[]> {
    const result = await this.repository
      .createQueryBuilder('prod')
      .leftJoinAndSelect('prod.imagenes', 'imagenes')
      .leftJoinAndSelect('prod.inventario', 'inventario')
      .leftJoinAndSelect('prod.categorias', 'categorias')
      .where('prod.destacado is true')
      .getMany();

    const products: ProductShopDto[] = [];
    result.forEach((element) => {
      if (element.inventario.length > 0) {
        element.inventario.forEach((invItem) => {
          element.imagenes = element.imagenes.sort(
            (a, b) => a.prioridad - b.prioridad,
          );
          if (
            invItem.cantidad > 0 &&
            !products.find((value) => value.id == element.id)
          ) {
            products.push({
              id: element.id,
              nombre: element.nombre,
              imagen:
                element.imagenes.length > 0 ? element.imagenes[0].url : '',
              precio: element.precio_venta,
            });
            return;
          }
        });
      }
    });
    return products;
  }

  /**
   * Obtener lista de productos mas visitados
   * @param filters
   */
  async findMostVisited(): Promise<ProductShopDto[]> {
    const result = await this.repository
      .createQueryBuilder('prod')
      .leftJoinAndSelect('prod.imagenes', 'imagenes')
      .leftJoinAndSelect('prod.inventario', 'inventario')
      .leftJoinAndSelect('prod.categorias', 'categorias')
      .where('prod.showInStore is true')
      .andWhere('prod.isDeleted is false')
      //.where('prod.showInStore is true')
      .orderBy('prod.contador_visitas', 'DESC')
      .limit(8)
      .getMany();
    const products: ProductShopDto[] = [];
    result.forEach((element) => {
      if (element.inventario.length > 0) {
        element.inventario.forEach((invItem) => {
          element.imagenes = element.imagenes.sort(
            (a, b) => a.prioridad - b.prioridad,
          );
          if (
            invItem.cantidad > 0 &&
            !products.find((value) => value.id == element.id)
          ) {
            products.push({
              id: element.id,
              nombre: element.nombre,
              imagen:
                element.imagenes.length > 0 ? element.imagenes[0].url : '',
              precio: element.precio_venta,
            });
            return;
          }
        });
      }
    });
    return products;
  }

  /**
   * Mostrar detalle de producto para mostrar en tienda
   * Cuenta las visitas a un producto pues esta api es llamada desde el
   * e-commerce
   * @param id de producto
   */
  async findOneToShop(id: number) {
    //consulta
    const result = await this.repository
      .createQueryBuilder('prod')
      .select([
        'prod.id',
        'prod.nombre',
        'prod.sku',
        'prod.descripcion',
        'prod.contador_visitas',
        'prod.precio_venta',
        'brand',
        'supplier.id',
        'supplier.nombre',
      ])
      .innerJoin('prod.marca', 'brand')
      .innerJoin('prod.proveedor', 'supplier')
      .innerJoinAndSelect('prod.color', 'color')
      .leftJoinAndSelect('prod.especificaciones', 'specsp')
      .leftJoinAndSelect('specsp.especificacion', 'spec')
      .leftJoinAndSelect('prod.categorias', 'categorias')
      .where('prod.id = :id', { id })
      .getOne();
    if (result) {
      //contador de visitas
      await this.repository.update(id, {
        contador_visitas: result.contador_visitas + 1,
      });
      ///////////////////
      const imgs = await this.repositoryImgs.find({
        where: { producto: id },
        select: ['url'],
        order: { prioridad: 'ASC' },
      });
      result['imagenes'] = imgs;
      result.especificaciones.forEach((element) => {
        element['nombre'] = element.especificacion
          ? element.especificacion.nombre
          : null;
        delete element.especificacion;
      });
    }
    return result;
  }

  /**
   * Verifica si hay existencias suficientes para surtir un producto
   * @param productId
   * @param cant
   */
  async haveExistencesToShop(
    productId: number,
    cant: number,
  ): Promise<boolean> {
    const element = await this.repository.findOne(productId, {
      relations: ['inventario'],
    });
    if (element.inventario.length > 0) {
      const index = element.inventario.findIndex(
        (element) => element.cantidad > cant,
      );
      return index != -1;
    }
    return false;
  }

  /**
   * Obtener información para carrito según id y cantidad de body
   * @param body
   */
  async findInfoProducts(
    body: InfoProductsDto[],
  ): Promise<InfoProductsResponseDto[]> {
    if (!body || !Array.isArray(body) || body.length <= 0) {
      return [];
    }
    const ids = [];
    body.forEach((element) => {
      ids.push(element.id);
    });
    const result = await this.repository
      .createQueryBuilder('prod')
      .leftJoinAndSelect('prod.imagenes', 'imagenes')
      .where('prod.id IN (:values)', { values: ids })
      .orderBy({ 'imagenes.prioridad': 'ASC' })
      .getMany();
    const products: InfoProductsResponseDto[] = [];
    result.forEach((element) => {
      const obj = body.find((e) => e.id == element.id);
      if (obj) {
        products.push({
          cantidad: obj.cantidad,
          id: element.id,
          imagen: element.imagenes.length > 0 ? element.imagenes[0].url : '',
          nombre: element.nombre,
          precio: element.precio_venta,
          sku: element.sku,
        });
      }
    });
    return products;
  }

  /**
   * Ocultar producto en la tienda
   * @param id_product
   */
  async hideProduct(id_product: number) {
    return (await this.repository.update(id_product, { showInStore: false }))
      .affected;
  }

  /**
   * Mostrar producto en la tienda
   * @param id_product
   */
  async showProduct(id_product: number) {
    return (await this.repository.update(id_product, { showInStore: true }))
      .affected;
  }

  /**
   * Mostrar productos que pertenecen a una sucursal
   * @param name
   */
  async productForStore(name: string) {
    const query = `select p.id, p.sku, p.nombre from inventario
    inner join producto p on inventario.producto_id = p.id
    inner join sucursal s on inventario.sucursal_id = s.id
    where s.nombre = '${name}' AND inventario.cantidad > 0;
    `;

    return await this.repository.query(query);
  }
}
