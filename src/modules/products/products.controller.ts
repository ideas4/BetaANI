import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/constants';
import { CreateProductDto } from '../inventory/dto/create-product.dto';
import { UpdateProductDto } from '../inventory/dto/update-product.dto';
import { ProductsService } from './products.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateImageProductDto } from '../inventory/dto/update-image-product.dto';
import { UpdateCategoryProductDto } from '../inventory/dto/update-category-product.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateSPecProductDto } from '../inventory/dto/update-spec-product.dto';
import { FilterProductDto } from '../inventory/dto/filter-product.dto';
import { InfoProductsDto } from '../inventory/dto/info-products.dto';
import { InfoProductsResponseDto } from '../inventory/dto/info-products-response.dto';

/**
 * Cambiar el nombre de los archivos subidos
 * @param req
 * @param file
 * @param callback
 */
const editFileName = (req, file, callback) => {
  const name = 'POS-PROD-';
  const fileExtName = extname(file.originalname);
  const randomName = Array(20)
    .fill(null)
    .map(() => Math.round(Math.random() * 10).toString(10))
    .join('');
  callback(null, `${name}${randomName}${fileExtName}`);
};

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Crear un nuevo producto
   * @param createProductDto
   */
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crea un producto' })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  @ApiNotAcceptableResponse({ description: 'El SKU ya existe' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * Obtener todos los productos
   */
  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener una lista de productos' })
  @ApiOkResponse({ status: 200, description: 'Productos Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  findAll() {
    return this.productsService.findAll();
  }

  /**
   * Obtener productos para llenar combobox y selects
   */
  @Get('fill/:isUnique')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Obtiene una lista de productos para llenar combobox o select',
  })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  fill(@Param() isUnique: boolean) {
    return this.productsService.findtoFill(isUnique);
  }

  /**
   * Obtener productos que pertenecen a una sucursal
   */
  @Get('productStore/:name')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Obtener productos que pertenecen a una sucursal.',
  })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  fillForStore(@Param('name') name: string) {
    return this.productsService.productForStore(name);
  }

  /**
   * Obtener lista de productos relacionados para uno la tienda
   * @param id
   */
  @Get('shop/relation/:id')
  @ApiTags('Public')
  @ApiOperation({
    summary: 'Obtener lista de productos relacionados para uno la tienda',
  })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  findToShopRelation(@Param('id') id: string) {
    return this.productsService.getRelationtoShop(id);
  }

  /**
   * Obtener el detalle de un producto con sus existencias en inventario
   * de distintas sucursales
   * @param id de producto
   */
  @Get('detail/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary:
      'Obtener el detalle de un producto con sus existencias en el inventario',
  })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  detail(@Param('id') id: string) {
    return this.productsService.findDetail(+id);
  }

  /**
   * Verificar si hay existencia de productos
   * @param id
   * @param cant
   */
  @Get('shop/:id/:cant')
  @ApiTags('Public')
  @ApiOperation({
    summary: 'Verifica si hay existencia disponible de un producto',
  })
  @ApiOkResponse({ status: 200, description: 'Producto Ok', type: Boolean })
  findExistenceToShop(@Param('id') id: number, @Param('cant') cant: number) {
    return this.productsService.haveExistencesToShop(id, cant);
  }

  /**
   * Obtener lista de productos mas visitados
   */
  @Get('shop/visited')
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtener productos más visitados' })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  visited() {
    return this.productsService.findMostVisited();
  }

  /**
   * Obtener info de producto para mostrar en tienda
   * Cuenta las visitas a un producto pues esta api es llamada desde el
   * e-commerce
   * @param id
   */
  @Get('shop/:id')
  @ApiTags('Public')
  @ApiOperation({
    summary: 'Obtener la información de un producto y cuenta las visitas',
  })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  findOneToShop(@Param('id') id: string) {
    return this.productsService.findOneToShop(+id);
  }

  /**
   * Obtener Información de productos enviados en el body de la petición
   * @param body
   */
  @Post('info')
  @ApiTags('Public')
  @ApiOperation({
    summary:
      'Obtener información de los productos enviados en el cuerpo de la petición',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Productos Ok',
    type: InfoProductsResponseDto,
  })
  findToShopProducts(@Body() body: InfoProductsDto[]) {
    return this.productsService.findInfoProducts(body);
  }

  /**
   * Obtener lista de productos para la tienda
   * @param body
   */
  @Post('shop')
  @ApiTags('Public')
  @ApiOperation({
    summary: 'Obtener la lista de productos con información básica',
  })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  findToShop(@Body() body: FilterProductDto) {
    return this.productsService.findToShopping(body);
  }

  /**
   * Obtener lista de productos para la tienda
   */
  @Get('featured')
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtener la lista de productos destacados' })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  findToFeatured() {
    return this.productsService.findToFeatured();
  }

  /**
   * Obtener los productos relacionados
   * @param id
   */
  @Get('relation/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener productos relacionados' })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  getRelation(@Param('id') id: string) {
    return this.productsService.getRelation(id);
  }

  /**
   * Obtener info de producto para editar
   * @param id
   */
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener la información de un producto' })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  /**
   * Relacionar productos
   * @param principal
   * @param rel
   */
  @Put('relation/:principal/:rel')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Relacionar productos' })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  @ApiNotAcceptableResponse({ description: 'El producto ya está relacionado' })
  relation(@Param('principal') principal: string, @Param('rel') rel: string) {
    return this.productsService.relation(principal, rel);
  }

  /**
   * Editar producto
   * @param id
   * @param updateProductDto
   */
  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Editar un producto' })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  @ApiNotAcceptableResponse({ description: 'El SKU ya existe' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  /**
   * Eliminar relacion entre productos
   * @param id
   */
  @Delete('relation/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Relacionar productos' })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  @ApiNotAcceptableResponse({ description: 'El producto ya está relacionado' })
  delRelation(@Param('id') id: string) {
    return this.productsService.deleteRelation(id);
  }

  /**
   * Eliminar un producto
   * @param id
   */
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Elimina un producto' })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  /**
   * Agregar imagen a producto
   * @param file Imagen
   * @param id de producto
   */
  @Post('image/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Agrega una imagen a un producto' })
  @ApiOkResponse({ status: 200, description: 'Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  @ApiBadRequestResponse({
    description: 'El producto ya tiene el máximo de cuatro imagenes',
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'uploads/images/products/',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadFile(@UploadedFile() file, @Param('id') id: string) {
    if (file) {
      return this.productsService.addImage(file.filename, id);
    } else {
      throw new HttpException('La imagen no es válida', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Eliminar una imagen de un producto
   * @param id de imagen producto
   */
  @Delete('image/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Eliminar una imagen de un producto' })
  @ApiOkResponse({ status: 200, description: 'Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  deleteImage(@Param('id') id: string) {
    return this.productsService.deleteImage(+id);
  }

  /**
   * Actualizar las prioridades de imagenes
   * @param id
   * @param body
   */
  @Put('image/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Modificar la prioridad de las imagenes de un producto',
  })
  @ApiOkResponse({ status: 200, description: 'Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  updateImage(@Param('id') id: string, @Body() body: UpdateImageProductDto) {
    return this.productsService.updateImagePriority(+id, body.imagen_id);
  }

  /**
   * Agregar una categoría
   * @param id de producto
   * @param body
   */
  @Put('category/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Agregar un producto a una categoría' })
  @ApiOkResponse({ status: 200, description: 'Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  addCategoryToProduct(
    @Param('id') id: string,
    @Body() body: UpdateCategoryProductDto,
  ) {
    return this.productsService.addCategoryToProduct(+id, body.categoria_id);
  }

  /**
   * Eliminar producto de una categoria
   * @param id de categoria_producto
   * @param cat
   */
  @Delete('category/:id/:cat')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Eliminar un producto de una categoría' })
  @ApiOkResponse({ status: 200, description: 'Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  deleteCategoryToProduct(@Param('id') id: string, @Param('cat') cat: string) {
    return this.productsService.deleteCategoryProduct(+id, +cat);
  }

  /**
   * Agregar una especificación
   * @param id de producto
   * @param body
   */
  @Put('spec/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Agregar un producto a una categoría' })
  @ApiOkResponse({ status: 200, description: 'Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  addSpecToProduct(
    @Param('id') id: string,
    @Body() body: UpdateSPecProductDto,
  ) {
    return this.productsService.addSpecToProduct(+id, body.spec_id, body.valor);
  }

  /**
   * Eliminar especificacion
   * @param id de categoria_producto
   * @param spec
   */
  @Delete('spec/:id/:spec')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Eliminar un producto de una categoría' })
  @ApiOkResponse({ status: 200, description: 'Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  deleteSpecToProduct(@Param('id') id: string, @Param('spec') spec: string) {
    return this.productsService.deleteSpecProduct(+id, +spec);
  }

  /**
   * Ocultar un producto en la tienda
   * @param id
   */
  @Put('hide-store/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Ocultar un producto en la tienda' })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  hide(@Param('id') id: string) {
    return this.productsService.hideProduct(+id);
  }

  /**
   * Mostrar un producto en tienda
   * @param id
   */
  @Put('show-store/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Mostrar un producto en tienda' })
  @ApiOkResponse({ status: 200, description: 'Producto Ok' })
  @ApiForbiddenResponse({ description: 'No está autorizado' })
  show(@Param('id') id: string) {
    return this.productsService.showProduct(+id);
  }
}
