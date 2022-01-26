import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UsersService } from 'src/modules/users/services/users/users.service';
import { updateUserDto } from '../../dtos/update-user.dto';

@Controller('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Users')
@ApiForbiddenResponse({ description: 'Frobidden' })
export class UsersController {
  constructor(private service: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Permite obtener una lista de todos los usuarios registrados',
  })
  @ApiOkResponse({ status: 200, description: 'Usuarios Ok' })
  getAll() {
    return this.service.findAll();
  }

  @Get('admin/fill')
  @ApiOperation({
    summary: 'Permite obtener una lista de todos los usuarios administativos',
  })
  @ApiOkResponse({ status: 200, description: 'Usuarios Ok' })
  fill() {
    return this.service.findtoFill();
  }

  @Get('sucursal/:user')
  @ApiOperation({
    summary:
      'Permite obtener el id de la sucursal por medio del nombre de usuario.',
  })
  @ApiOkResponse({ status: 200, description: 'Usuarios Ok' })
  getSucursal(@Param('user') user: string) {
    return this.service.getIdSucursal(user);
  }

  @Get('roles')
  @ApiOperation({
    summary:
      'Permite obtener una lista de todos los roles disponibles para usuarios',
  })
  @ApiOkResponse({ status: 200, description: 'Usuarios Ok' })
  fillRoles() {
    return this.service.findRolesToFill();
  }

  @Get('status')
  @ApiOperation({
    summary: 'Permite obtener una lista de los estados de los usuarios',
  })
  @ApiOkResponse({ status: 200, description: 'Usuarios Ok' })
  fillStatus() {
    return this.service.findStatusToFill();
  }

  @Get('password/:id')
  @ApiOperation({
    summary: 'Permite generar una contraseña aleatoria para un usuario',
  })
  @ApiOkResponse({ status: 200, description: 'Usuarios Ok' })
  randomPassword(@Param() params) {
    return this.service.SetRandomPassword(params.id);
  }

  @Get('access-log')
  @ApiOperation({ summary: 'Permite obtener una lista los accesos' })
  @ApiOkResponse({ status: 200, description: 'Log Ok' })
  getLog() {
    return this.service.getLogs();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Permite obtener la información de un usuario para edición',
  })
  @ApiOkResponse({ status: 200, description: 'Usuarios Ok' })
  getOne(@Param() params) {
    return this.service.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Permite crear un nuevo usuario' })
  @ApiOkResponse({ status: 200, description: 'Usuarios Ok' })
  @ApiNotAcceptableResponse({ description: 'El nombre de usuario ya existe' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.service.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'aPermite modificar un nuevo usuario' })
  @ApiOkResponse({ status: 200, description: 'Usuarios Ok' })
  @ApiNotAcceptableResponse({ description: 'El nombre de usuario ya existe' })
  update(@Param('id') id: string, @Body() createUserDto: updateUserDto) {
    return this.service.update(+id, createUserDto);
  }
}
