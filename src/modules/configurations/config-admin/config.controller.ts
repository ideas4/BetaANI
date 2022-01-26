import { Controller, Get, Body, Put, UseGuards } from '@nestjs/common';
import { ConfigService } from './config.service';
import { UpdateConfigDto } from './dto/update-config.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailConfigDto } from './dto/email-config.dto';
import { ServerEmailDto } from './dto/server-email.dto';
import { NotificationMailConfigDto } from './dto/notification-mail-config.dto';
import { QuotesTemplateDto } from './dto/quotes-template.dto';

@Controller('config')
@ApiTags('Config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtiene las configuraciones de la plataforma' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  findAll() {
    return this.configService.findOne();
  }

  @Get('email')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener el correo configurado para recibir notificaciones' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  getEmail() {
    return this.configService.getEmailConfig();
  }

  @Get('email-server')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener la información del servidor de correo' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  getServerEmail() {
    return this.configService.getServerEmailConfig();
  }

  @Get('email-notifications')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener la información del correo para enviar mensajeria a clientes' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  getNotiEmail() {
    return this.configService.getNotiEmailConfig();
  }

  @Get('templates-quote')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener la plantillas plantillas de email y pdf para cotización' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  getTemplatesQuote() {
    return this.configService.getTemplatesQuote();
  }


  @Put()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Actualizar las configuraciones de la plataforma' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  update(@Body() updateConfigDto: UpdateConfigDto) {
    return this.configService.update(updateConfigDto);
  }

  @Put('email')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Actualiza el correo configurado para recibir notificaciones' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  updateEmail(@Body() updateConfigDto: EmailConfigDto) {
    return this.configService.updateEmailConfig(updateConfigDto)
  }

  @Put('email-server')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Actualiza el servidor de correos' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  updateEmailConfig(@Body() body: ServerEmailDto) {
    return this.configService.updateServerEmailConfig(body)
  }

  @Put('email-notifications')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Actualiza la información de correos para enviar mensajería a clientes' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  updateEmailNotiConfig(@Body() body: NotificationMailConfigDto) {
    return this.configService.updateNotiEmailConfig(body)
  }

  @Put('templates-quote')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Actualiza las plantillas de email y pdf para cotizaciones' })
  @ApiOkResponse({status: 200,description: 'Información Ok'})
  updateTemplatesQuote(@Body() body: QuotesTemplateDto) {
    return this.configService.updateTemplatesQuote(body)
  }

}
