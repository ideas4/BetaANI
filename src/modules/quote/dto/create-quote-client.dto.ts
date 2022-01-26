import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';
import { InfoProductsDto } from '../../inventory/dto/info-products.dto';

export class CreateQuoteClientDto {
  @IsDefined({ message: 'El nombre del cliente es requerido' })
  @IsNotEmpty({ message: 'El nombre del cliente es requerido' })
  cliente: string;

  @IsDefined({ message: 'La dirección de entrega es requerida' })
  @IsNotEmpty({ message: 'La dirección de entrega es requerida' })
  direccion: string;

  @IsDefined({ message: 'El teléfono del cliente es requerido' })
  @IsNotEmpty({ message: 'El teléfono del cliente es requerido' })
  telefono: string;

  @IsEmail({}, { message: 'El correo tiene un formato inválido' })
  email: string;

  productos: InfoProductsDto[];
}
