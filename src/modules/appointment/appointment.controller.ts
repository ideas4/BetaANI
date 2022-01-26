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
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointment')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Permite crear una cita' })
  @ApiOkResponse({ status: 200, description: 'Cita Ok' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get('color')
  @ApiOperation({
    summary: 'Permite obtener una lista de citas con el parametro de colores.',
  })
  @ApiOkResponse({ status: 200, description: 'Cita Ok' })
  findAllWithColor() {
    return this.appointmentService.findAllWithColor();
  }

  @Get()
  @ApiOperation({ summary: 'Permite obtener una lista de citas' })
  @ApiOkResponse({ status: 200, description: 'Cita Ok' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Permite obtener la información de una cita especifica',
  })
  @ApiOkResponse({ status: 200, description: 'Cita Ok' })
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Permite editar una cita' })
  @ApiOkResponse({ status: 200, description: 'Cita Ok' })
  update(
    @Param('id') id: string,
    @Body() UpdateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(+id, UpdateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permite eliminar una cita' })
  @ApiOkResponse({ status: 200, description: 'Cita Ok' })
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }
}
