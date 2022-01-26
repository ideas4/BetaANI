import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNotAcceptableResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfiguracionFelService } from './configuracion-fel.service';
import { CreateConfiguracionFelDto } from './dto/create-configuracion-fel.dto';
import { UpdateConfiguracionFelDto } from './dto/update-configuracion-fel.dto';

@Controller('configuracion-fel')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Configuracion-Fel')
export class ConfiguracionFelController {
    constructor(private readonly: ConfiguracionFelService){}

    @Post()
    @ApiOperation({ summary: 'Permite crear una configuracion fel' })
    @ApiOkResponse({status: 200,description: 'ConfiguracionFel OK'})
    @ApiNotAcceptableResponse({description:'La configuracion ya existe.'})
    createBill(@Body() createConfigFelDto: CreateConfiguracionFelDto){
        return this.readonly.create(createConfigFelDto);
    }

    @Get()
    @ApiOperation({ summary: 'Permite obtener una lista de las configuraciones Fel' })
    @ApiOkResponse({status: 200,description: 'ConfiguracionFel Ok'})
    findAll() {
      return this.readonly.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Permite obtener la información de una configuracionFel en especifico' })
    @ApiOkResponse({status: 200,description: 'ConfiguracionFel Ok'})
    findOne(@Param('id') id: number) {
      return this.readonly.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Permite actualiza la información de la configuracion fel.' })
    @ApiOkResponse({status: 200,description: 'ControlDTE Ok'})
    update(@Param('id') id: number, @Body() updateConfiguracionFel : UpdateConfiguracionFelDto) {
        return this.readonly.update(id, updateConfiguracionFel)
    }



}
