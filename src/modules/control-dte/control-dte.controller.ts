import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ControlDteService } from './control-dte.service';
import { CreateControlDteDto } from './dto/create-control-dte.dto';
import { UpdateControlDteDto } from './dto/update-control-dte.dto';

@Controller('control-dte')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Control-dte')
export class ControlDteController {
    constructor(private readonly: ControlDteService){}

    @Post()
    @ApiOperation({ summary: 'Permite crear un registro de control dte' })
    @ApiOkResponse({status: 200,description: 'ControlDte OK'})
    @ApiNotAcceptableResponse({description:'El control ya existe.'})
    createBill(@Body() createControlDto: CreateControlDteDto){
        return this.readonly.create(createControlDto);
    }

    @Get()
    @ApiOperation({ summary: 'Permite obtener una lista del Control DTE' })
    @ApiOkResponse({status: 200,description: 'ControlDTE Ok'})
    findAll() {
      return this.readonly.findAll();
    }

    @Get(':id/:lote')
    @ApiOperation({ summary: 'Permite obtener la información de un controlDTE' })
    @ApiOkResponse({status: 200,description: 'ControlDTE Ok'})
    findOne(@Param('id') id: number, @Param('lote') lote:number) {
      return this.readonly.findOne(id, lote);
    }


    @Put(':id/:lote')
    @ApiOperation({ summary: 'Permite actualiza la información de un control dte.' })
    @ApiOkResponse({status: 200,description: 'ControlDTE Ok'})
    update(@Param('id') id: number, @Param('lote') lote:number, @Body() updateControlDteDto : UpdateControlDteDto) {
        return this.readonly.update(id, lote, updateControlDteDto)
    }


}
