import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { Any } from 'typeorm';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Bill } from './entities/bill.entity';

@Controller('bill')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Bill')
export class BillController {
    constructor(private readonly: BillService){}

    @Post()
    @ApiOperation({ summary: 'Permite crear una factura' })
    @ApiOkResponse({status: 200,description: 'Factura OK'})
    @ApiNotAcceptableResponse({description:'La factura ya existe'})
    createBill(@Body() createBillDto:CreateBillDto){
        //call service
        // console.log("tipo: " + createBillDto.tipo);
        // console.log("serie: " + createBillDto.serie);
        // console.log("numero: " + createBillDto.numero);
        // console.log("fecha: " + createBillDto.fecha);
        return this.readonly.create(createBillDto);
    }


    @Get()
    @ApiOperation({ summary: 'Permite obtener una lista de facturas' })
    @ApiOkResponse({status: 200,description: 'Facturas Ok'})
    findAll() {
      return this.readonly.findAll();
    }

    @Put(':tipo/:serie/:numero')
    @ApiOperation({ summary: 'Permite obtener la información de una factura para editar' })
    @ApiOkResponse({status: 200,description: 'Factura Ok'})
    update(@Param('tipo') tipo: number, @Param('serie') serie:string, @Param('numero') numero: string, @Body() updateBillDto : UpdateBillDto) {
        return this.readonly.update(tipo,serie,numero,updateBillDto)
    }


    @Get(':tipo/:serie/:numero')
    @ApiOperation({ summary: 'Permite obtener la información de una factura' })
    @ApiOkResponse({status: 200,description: 'Factura Ok'})
    findOne(@Param('tipo') tipo: number, @Param('serie') serie:string, @Param('numero') numero: string) {
      return this.readonly.findOne(tipo,serie,numero);
    }

    @Get('filtroFecha/:fechaStart/:fechaEnd')
    @ApiOperation({ summary: 'Permite obtener las facturas por medio de un rango de fechas' })
    @ApiOkResponse({status: 200,description: 'Factura Ok'})
    findDate(@Param('fechaStart') fechaStart: string, @Param('fechaEnd') fechaEnd:string) {
      // console.log(fechaStart, fechaEnd);
      return this.readonly.filterDate(fechaStart, fechaEnd);
    }
    
}
