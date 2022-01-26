import { Controller, Get, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JWTPayload } from '../users/dtos/jwt-payload.dto';
import { Auth } from '../users/services/auth/auth.decorator';
import { ReportsService } from './reports.service';

@Controller('reports')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Reports')
export class ReportsController {

    constructor(private reportService:ReportsService){}

    @Get('pretty-cash')
    @ApiOperation({ summary: 'Permite obtener el reporte de caja chica de la sucursal a la que pertenece el usuario' })
    @ApiOkResponse({status: 200,description: 'Caja Chica Ok'})
    getReportDay(@Auth() info:JWTPayload){
        if(info.sucursal> 0){
            return this.reportService.getPrettyCash(info.sucursal);
        }else{
            throw new HttpException('Caja chica para admin general',HttpStatus.BAD_REQUEST);
        }
    }
}
