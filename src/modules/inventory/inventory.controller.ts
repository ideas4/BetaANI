import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ModifyStockDto } from './dto/modify-stock.dto';
import { MoveStockDto } from './dto/move-stock.dto';
import { InventoryService } from './services/inventory/inventory.service';
import { LogInventoryService } from './services/log-inventory/log-inventory.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/modules/users/services/auth/auth.decorator';
import { JWTPayload } from 'src/modules/users/dtos/jwt-payload.dto';


@Controller('inventory')
@ApiTags('Inventory')
export class InventoryController {

    constructor(private inventoryService:InventoryService,
        private logInventoryService:LogInventoryService){}

    /**
     * Obtener el inventario
     */
    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Obtiene la información del inventario' })
    @ApiOkResponse({status: 200,description: 'Inventario Ok'})
    @ApiForbiddenResponse({description:'No está autorizado'})  
    getAll(){
        return this.inventoryService.getInventory();
    }

    /**
     * Obtener el log del inventario
     */
    @Get('log')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Obtiene el registro de la información del inventario' })
    @ApiOkResponse({status: 200,description: 'Inventario Ok'})
    @ApiForbiddenResponse({description:'No está autorizado'}) 
    getLog(@Auth() info:JWTPayload){
        return this.logInventoryService.getLogs(info.sucursal);
    }

    /**
     * Obtener los productos disponibles en inventario para 
     * select o combobox 
     */
    @Get('fill')
    @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Obtiene la información del inventario' })
    @ApiOkResponse({status: 200,description: 'Inventario Ok'})
    @ApiForbiddenResponse({description:'No está autorizado'}) 
    findToFill(){
        return this.inventoryService.findToFill();
    }

    /**
     * Obtener el resultado de una busqueda en el inventario
     * @param value cadena
     */
    @Get('search/:value')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Obtiene la información del inventario resultado de una búsqueda' })
    @ApiOkResponse({status: 200,description: 'Inventario Ok'})
    @ApiForbiddenResponse({description:'No está autorizado'}) 
    search(@Param('value') value: string){
        return this.inventoryService.search(value);
    }

  /**
   * Obtener un producto y verificar existencia en todas las sucursales
   * Para agregar a cotización
   */
  @Get('prod/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener un producto y verificar existencia en todas las sucursales Para agregar a cotización' })
  @ApiOkResponse({status: 200,description: 'Inventario Ok'})
  @ApiForbiddenResponse({description:'No está autorizado'})
  findToQuote(@Param('id') id: string){
    return this.inventoryService.findToQuote(+id);
  }

    /**
     * Obtener registro de inventario para crear orden
     */
    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Obtiene el registro de inventario' })
    @ApiOkResponse({status: 200,description: 'Inventario Ok'})
    @ApiForbiddenResponse({description:'No está autorizado'}) 
    findToOrderFill(@Param('id') id: string){
        return this.inventoryService.findToFillProduct(+id);
    }

    /**
     * Modificar el stock de un producto
     * @param modifyStock 
     */
    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Agregar stock a una entrada de inventario' })
    @ApiOkResponse({status: 200,description: 'Inventario Ok'})
    @ApiForbiddenResponse({description:'No está autorizado'}) 
    addStock(@Body() modifyStock:ModifyStockDto){
        return this.inventoryService.addProductStock(modifyStock);
    }

    /**
     * Marcar producto dañado
     * @param modifyStock 
     */
    @Post('damage')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Agregar producto dañado a una entrada de inventario' })
    @ApiOkResponse({status: 200,description: 'Inventario Ok'})
    @ApiForbiddenResponse({description:'No está autorizado'}) 
    addDamageStock(@Body() modifyStock:ModifyStockDto){
        return this.inventoryService.addProductDamage(modifyStock);
    }

    /**
     * Mover inventario de sucursal a sucursal
     * @param moveStock
     * @param paylod
     */
    @Post('move')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Mover unidades de inventario de una sucursal a otra' })
    @ApiOkResponse({status: 200,description: 'Inventario Ok'})
    @ApiForbiddenResponse({description:'No está autorizado'}) 
    moveStock(@Body() moveStock:MoveStockDto,@Auth() paylod:JWTPayload){
        return this.inventoryService.moveProduct(moveStock,paylod.id);
    }

}
