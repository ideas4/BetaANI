import { Body, Controller, HttpCode, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNotAcceptableResponse, ApiTags, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from 'src/modules/users/dtos/login.user.dto';
import { AuthService } from 'src/modules/users/services/auth/auth.service';
import { ConfirmAccountDto } from '../../dtos/confirm-account.dto';
import { SuscriptorUserDto } from '../../dtos/new-suscriptor.dto';
import { RegisterUserDto } from '../../dtos/register-user.dto';
import { NewPasswordDto } from '../../dtos/new-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from '../../services/auth/auth.decorator';
import { JWTPayload } from '../../dtos/jwt-payload.dto';
import { FreeContactDto } from '../../../configurations/config-admin/dto/free-contact.dto';

@Controller('auth')
@ApiTags('Autentication')
export class AuthController {

    constructor(private authService:AuthService){}

    @Post('login')
    @ApiTags('Public')
    @ApiOperation({ summary: 'Permite Iniciar sesión a un usuario' })
    @ApiOkResponse({status: 200,description: 'Usuario Ok'})
    @ApiForbiddenResponse({description:'Frobidden'})
    @ApiBadRequestResponse({description:'La cuenta se encuentra inactiva'})
    @ApiBadRequestResponse({description:'Contraseña incorrecta'})
    @ApiNotFoundResponse({description:'El correo electrónico no existe'})
    async login(@Body() login:LoginUserDto){
      try{
        return this.authService.login(login.usuario,login.contrasenia);
    }catch(ex){
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    }

    /**
     * Login para usuarios de e-commerce
     * @param login 
     */
    @Post('login-e')
    @ApiTags('Public')
    @ApiOperation({ summary: 'Permite Iniciar sesión a un usuario' })
    @ApiOkResponse({status: 200,description: 'Usuario Ok'})
    @ApiForbiddenResponse({description:'Frobidden'})
    @ApiBadRequestResponse({description:'La cuenta se encuentra inactiva'})
    @ApiForbiddenResponse({description:'Contraseña incorrecta'})
    @ApiNotFoundResponse({description:'El correo electrónico no existe'})
    async login_e(@Body() login:LoginUserDto){
        return this.authService.login_ecommerce(login.usuario,login.contrasenia);
    }

    @Post('register')
    @ApiTags('Public')
    @ApiOperation({ summary: 'Permite a un usuario del e-commerce registrarse' })
    @ApiOkResponse({status: 200,description: 'Usuario Ok'})
    @ApiForbiddenResponse({description:'Frobidden'})
    @ApiNotAcceptableResponse({description:'El correo electrónico ya está registrado'})
    async registerUser(@Body() body:RegisterUserDto){
        return this.authService.register(body);
    }

    @Post('suscriptor')
    @ApiTags('Public')
    @ApiOperation({ summary: 'Permite a un usuario suscriptor en el e-commerce' })
    @ApiOkResponse({status: 200,description: 'Usuario Ok'})
    @ApiForbiddenResponse({description:'Frobidden'})
    @ApiNotAcceptableResponse({description:'El correo electrónico ya está registrado'})
    async suscriptorUser(@Body() body:SuscriptorUserDto){
      try{
            return this.authService.regSuscriptor(body);
        }catch(ex){
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }

    @Post('confirm-account')
    @ApiTags('Public')
    @ApiOperation({ summary: 'Permite a un usuario del e-commerce confirmar su cuenta' })
    @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
    @ApiBadRequestResponse({description:'Solicitud de Confirmación Inválida'})
    @ApiForbiddenResponse({description:'Frobidden'})
    async confirmAccount(@Body() body:ConfirmAccountDto){
      try{
            return this.authService.confirmAccount(body);
        }catch(ex){
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }

    @Post('reset-password')
    @ApiTags('Public')
    @ApiOperation({ summary: 'Permite a un usuario recuperar la contraseña' })
    @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
    @ApiBadRequestResponse({description:'Solicitud de Confirmación Inválida'})
    @ApiForbiddenResponse({description:'Frobidden'})
    resetPassword(@Body() body:{email:string}){
        console.log('enviar');
      return this.authService.resetPassword(body.email);
    }

    @Post('new-password')
    @ApiTags('Public')
    @ApiOperation({ summary: 'Permite a un usuario ingresar una nueva contraseña' })
    @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
    @ApiBadRequestResponse({description:'Enlace inválido'})
    @ApiForbiddenResponse({description:'Frobidden'})
    newPassword(@Body() body:NewPasswordDto){
        return this.authService.newPassword(body);
    }


    @Post('logout')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Registra el cierre de sesión de un usuario' })
    @ApiOkResponse({status: 200,description: 'Cuenta Ok'})
    @ApiBadRequestResponse({description:'No existe el usuario'})
    @ApiForbiddenResponse({description:'Frobidden'})
    logout(@Auth() info:JWTPayload){
        return this.authService.logout(+info.id);
    }


    @Post('contact')
    @ApiTags('Public')
    @ApiOperation({ summary: 'Envia un mensaje de un usuario al correo configurado de la administración' })
    @ApiOkResponse({status: 200,description: 'Información Ok'})
    sendMail(@Body() mail: FreeContactDto) {
        return this.authService.sendContact(mail);
    }
}
