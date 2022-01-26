import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { AppointmentTypeService } from './appointment-type.service';
import { CreateAppointmentTypeDto } from './dto/create-appointment-type.dto';
import { UpdateAppointmentTypeDto } from './dto/update-appointment-type.dto';

@Controller('appointment-type')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Appointment-Type')
export class AppointmentTypeController {
  constructor(
    private readonly appointmentTypeService: AppointmentTypeService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear un tipo de cita.' })
  @ApiOkResponse({ status: 200, description: 'Tipo Cita Ok' })
  create(@Body() createAppointmentTypeDto: CreateAppointmentTypeDto) {
    return this.appointmentTypeService.create(createAppointmentTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de tipos de citas.' })
  @ApiOkResponse({ status: 200, description: 'Tipo Cita Ok' })
  findAll() {
    return this.appointmentTypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Permite obtener la información de un tipo de cita.',
  })
  @ApiOkResponse({ status: 200, description: 'Tipo Cita Ok' })
  findOne(@Param('id') id: string) {
    return this.appointmentTypeService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite editar un tipo de cita.' })
  @ApiOkResponse({ status: 200, description: 'Cita Ok' })
  update(
    @Param('id') id: string,
    @Body() UpdateAppointmentTypeDto: UpdateAppointmentTypeDto,
  ) {
    return this.appointmentTypeService.update(+id, UpdateAppointmentTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar una Tipo de cita' })
  @ApiOkResponse({ status: 200, description: 'Tipo Cita Ok' })
  remove(@Param('id') id: string) {
    return this.appointmentTypeService.remove(+id);
  }
}
