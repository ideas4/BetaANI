import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, UseInterceptors, UploadedFile, HttpStatus, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigEcommerceService } from './config-ecommerce.service';
import { BannerInfoEcommerceDto } from './dto/banner-info.dto';
import { ColorsEcommerceDto } from './dto/colores-info.dto';
import { CreateConfigEcommerceDto } from './dto/create-config-ecommerce.dto';
import { FooterInfoEcommerceDto } from './dto/footer-info.dto';
import { HomeInfoEcommerceDto } from './dto/home-info.dto';
import { InfoEcommerceDto } from './dto/info.dto';
import { diskStorage } from 'multer';
import { imageFileFilter } from 'src/constants';
import { extname } from 'path';
import { EmailMessageAccountDto } from './dto/email-message-account.dto';
import { EmailMessageOrderDto } from './dto/email-message-order.dto';
import { FeaturedCategoryDto } from './dto/featured-category.dto';
import { CreateFeatCategoryDto } from './dto/create-feat-category.dto';
import { UpdateFeatCategoryDto } from './dto/update-feat-category.dto';
import { PromoDto } from './dto/promo.dto';
/**
 * Cambiar el nombre de los archivos subidos
 * @param req 
 * @param file 
 * @param callback 
 */
const editFileName = (req, file, callback)=>{
  const name = 'EC-LOGO-';
  const fileExtName = extname(file.originalname);
  const randomName = Array(20)
    .fill(null)
    .map(() => Math.round(Math.random() * 10).toString(10))
    .join('');
  callback(null, `${name}${randomName}${fileExtName}`);
}

@Controller('config-ecommerce')
@ApiTags('Configuration','e-commerce')
export class ConfigEcommerceController {
  constructor(private readonly configEcommerceService: ConfigEcommerceService) {}

  /*@Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crea la configuración del e-commerce' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  @ApiConflictResponse({description:'Ya existe una configuración de tienda creada'})
  create(@Body() createConfigEcommerceDto: CreateConfigEcommerceDto) {
    return this.configEcommerceService.create(createConfigEcommerceDto);
  }*/

  @Get('home')
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtiene la información de inicio del e-commerce' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:HomeInfoEcommerceDto})
  @ApiNotFoundResponse({description:'No existe una configuración de tienda creada'})
  findAll() {
    return this.configEcommerceService.findHome();
  }

  @Get('info')
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtiene la información de inicio del e-commerce' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:HomeInfoEcommerceDto})
  @ApiNotFoundResponse({description:'No existe una configuración de tienda creada'})
  findInfo() {
    return this.configEcommerceService.findInfo();
  }

  @Get('logo')
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtiene la URL del logo' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  @ApiNotFoundResponse({description:'No existe una configuración de tienda creada'})
  findLogo() {
    return this.configEcommerceService.getLogo();
  }

  @Get('footer')
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtiene la información del footer del e-commerce' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:FooterInfoEcommerceDto})
  @ApiNotFoundResponse({description:'No existe una configuración de tienda creada'})
  findAllFooter() {
    return this.configEcommerceService.findFooter();
  }

  @Get('terminos_condiciones')
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtiene los términos y condiciones de compra' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:FooterInfoEcommerceDto})
  @ApiNotFoundResponse({description:'No existe una configuración de tienda creada'})
  findTerminos() {
    return this.configEcommerceService.findTerminos();
  }

  @Get('colors')
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtiene la paleta de colores del e-commerce' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:ColorsEcommerceDto})
  @ApiNotFoundResponse({description:'No existe una configuración de tienda creada'})
  findColors() {
    return this.configEcommerceService.findColors();
  }

  @Get('promo')
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtiene el banner de la promoción del mes si existe' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:String})
  @ApiNotFoundResponse({description:'No existe una configuración de tienda creada'})
  findPromo() {
    return this.configEcommerceService.findPromo();
  }

  @Get('banner')
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtiene el banner de inicio del e-commerce' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:BannerInfoEcommerceDto})
  @ApiNotFoundResponse({description:'No existe una configuración de tienda creada'})
  findBanner() {
    return this.configEcommerceService.findBanner();
  }

  @Get('featured-categories')
  @ApiTags('Public')
  @ApiOperation({ summary: 'Obtiene las categorias destacadas' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:FeaturedCategoryDto})
  @ApiNotFoundResponse({description:'No existe una configuración de tienda creada'})
  findCategories() {
    return this.configEcommerceService.findCategories();
  }

  @Get('featured-categories/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtiene una categoria destacada' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:FeaturedCategoryDto})
  @ApiUnauthorizedResponse()
  findCategory(@Param() id:string) {
    return this.configEcommerceService.findCategory(id);
  }

  @Get('email-welcome')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtiene el mensaje de correo electronico para confirmación de cuentas' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:BannerInfoEcommerceDto})
  @ApiNotFoundResponse({description:'No existe una configuración de tienda creada'})
  findEmailMessage() {
    return this.configEcommerceService.findWelcomeMessage();
  }

  @Get('email-order')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtiene el mensaje de correo electronico para ordenes' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:BannerInfoEcommerceDto})
  @ApiNotFoundResponse({description:'No existe una configuración de tienda creada'})
  findEmailOrder() {
    return this.configEcommerceService.findOrderMessage();
  }


  @Put('home')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Modifica la información de inicio del e-commerce' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:HomeInfoEcommerceDto})
  updateHome(@Body() body:HomeInfoEcommerceDto) {
    return this.configEcommerceService.updateHome(body);
  }

  @Put('info')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Modifica la información de inicio del e-commerce' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:HomeInfoEcommerceDto})
  updateInfo(@Body() body:InfoEcommerceDto) {
    return this.configEcommerceService.updateInfo(body);
  }

  @Put('footer')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))    
  @ApiOperation({ summary: 'Modifica la información del footer del e-commerce' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:FooterInfoEcommerceDto})
  updateFooter(@Body() body:FooterInfoEcommerceDto) {
    return this.configEcommerceService.updateFooter(body);
  }

  @Put('colors')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Modifica la paleta de colores del e-commerce' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:ColorsEcommerceDto})
  updateColors(@Body() body:ColorsEcommerceDto) {
    return this.configEcommerceService.updateColors(body);
  }

  @Put('promo')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Modifica el banner de la promoción del mes si existe' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:String})
  updatePromo(@Body() body:PromoDto) {
    return this.configEcommerceService.updatePromo(body);
  }

  @Put('banner')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Modifica el banner de inicio del e-commerce' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:BannerInfoEcommerceDto})
  updateBanner(@Body() body:BannerInfoEcommerceDto) {
    return this.configEcommerceService.updateBanner(body);
  }


  /**
   * Agregar imagen a producto
   * @param file Imagen
   * @param id de producto
   */
  @Post('logo')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Agrega la imagen del logo' })
  @ApiOkResponse({status: 200,description: 'Ok'})
  @ApiForbiddenResponse({description:'No está autorizado'}) 
  @ApiBadRequestResponse({description:'El producto ya tiene el máximo de cuatro imagenes'}) 
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'uploads/images/config/',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadFile(@UploadedFile() file, @Param('id') id: string) {
    if(file){
      return {filename:file.filename};
    }else{
      throw new HttpException('La imagen no es válida',HttpStatus.BAD_REQUEST);
    }
  }

  @Put('email-welcome')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Modifica mensaje de correo de confirmación de cuenta' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:String})
  updateEmailAccount(@Body() body:EmailMessageAccountDto) {
    return this.configEcommerceService.updateWelcomeMessage(body);
  }

  @Put('email-order')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Modifica el mensaje de correo de ordenes' })
  @ApiOkResponse({status: 200,description: 'Información Ok',type:BannerInfoEcommerceDto})
  updateEmailOrder(@Body() body:EmailMessageOrderDto) {
    return this.configEcommerceService.updateOrderMessage(body);
  }

  @Post('featured-categories')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Agrega una categoria destacada' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  @ApiConflictResponse({description:'La categoría ya es destacada'})
  addCategoryFeat(@Body() body:CreateFeatCategoryDto) {
    return this.configEcommerceService.addCategory(body);
  }

  @Put('featured-categories/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Actualiza una categoria destacada' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  updateCategoryFeat(@Body() body:UpdateFeatCategoryDto,@Param() id:string) {
    console.log(body,id)
    return this.configEcommerceService.updateCategory(id,body);
  }

  @Delete('featured-categories/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Actualiza una categoria destacada' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  deleteCategoryFeat(@Param() id:string) {
    return this.configEcommerceService.deleteCategory(id);
  }

  @Put('featured-products/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Agrega productos como destacados' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  @ApiConflictResponse({description:'Solo deben existir cuatro productos destacados'})
  addFeaturedProduct(@Param() id:string) {
    return this.configEcommerceService.addFeaturedProduct(id);
  }

  @Delete('featured-products/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Quitar productos como destacados' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  deleteFeaturedProduct(@Param() id:string) {
    return this.configEcommerceService.deleteFeaturedProduct(id);
  }

}
