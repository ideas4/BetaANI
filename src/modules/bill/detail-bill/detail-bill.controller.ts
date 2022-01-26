import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DetailBillService } from './detail-bill.service';
import { CreateDetailBillDto } from './dto/create-detailBill.dto';

@Controller('detail-bill')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('detail-bill')
export class DetailBillController {
    constructor(private readonly: DetailBillService){}

    @Post()
    @ApiOperation({ summary: 'Permite crea un articulo a la factura' })
    @ApiOkResponse({status: 200,description: 'Detalle OK'})
    
    createBill(@Body() createDetailBillDto:CreateDetailBillDto){
        return this.readonly.create(createDetailBillDto);
    }


    @Get()
    @ApiOperation({ summary: 'Permite obtener una lista de articulos de todas las facturas' })
    @ApiOkResponse({status: 200,description: 'Facturas Ok'})
    findAll() {
      return this.readonly.findAll();
    }


    @Get(':tipo/:serie/:numero')
    @ApiOperation({ summary: 'Permite obtener la información del detalle' })
    @ApiOkResponse({status: 200,description: 'Factura Ok'})
    findOne(@Param('tipo') tipo: number, @Param('serie') serie:string, @Param('numero') numero: string) {
      return this.readonly.findAny(tipo,serie,numero);
    }

}
