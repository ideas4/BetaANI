import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';
import { ProductQuoteDto } from './product-quote.dto';

export class CreateQuoteDto {
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

  no_guia: string;

  nit_cliente: string;

  no_factura: string;

  total: string;

  envio: any;

  productos: ProductQuoteDto[];

  estado: any;

  @IsDefined({ message: 'El método de pago es requerido' })
  metodo_pago: any;

  @IsDefined({ message: 'Tipo de entrega es requerido' })
  tipo_entrega: any;

  @IsDefined({ message: 'La vigencia es requerida' })
  vigencia: any;

  encabezado_pagina: any;
  terminos_pago: any;
  condiciones: any;
  pie_pagina: any;
  garantia: any;
  email_firma: string;
  email_mensaje: string;

  clientQuoteId?: number | string;
}
