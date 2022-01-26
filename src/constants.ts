import { HttpException, HttpStatus } from '@nestjs/common';

export const CLAVE_ADMINISTRADOR = '1234';
export const JWT_SECRET = 'gi4S2020_007*';
export const CRYPTO_SECRET = 'gi4S2+020_007';
export const CANT_ROL_ADMIN = 5;

// DATABASE TECNIPLAST
export const DatabaseInfo = {
  host: 'db-mysql-nyc1-38997-do-user-8600954-0.b.db.ondigitalocean.com',
  port: 25060,
  username: 'doadmin',
  password: 'p3qxzb6p8og6iuil',
  database: 'demoANI',
  insecureAuth: true,
};

export const enum Roles {
  ADMINISTRADOR = 1,
  ENCARGADO = 2,
  VENDEDOR = 3,
  VENDEDOR_JR = 4,
  ENCARGADO_BODEGA = 5,
  CLIENTE = 6,
  SUSCRIPTOR = 7,
}

export const enum EstadosUsuario {
  ACTIVO = 1,
  INACTIVO = 2,
  BLOQUEADO = 3,
  ARCHIVADO = 4,
}

export const enum TipoOrden {
  POS = 1,
  ECOMMERCE = 2,
}

export const enum EstadoOrden {
  EN_TRANSITO = 1,
  ENTREGADO = 2,
  ANULADO_POR_CLIENTE = 3,
  CONFIRMADO_VENTA = 4,
}

export const enum EstadoCotizacion {
  SIN_RESPUESTA = 1,
  CONFIRMADA = 2,
  ENVIADA = 3,
  CANCELAR = 4,
  INGRESADA_POR_CLIENTE = 5,
}

export const enum MetodoPago {
  PAGO_CONTRA_ENTEGA = 1,
}

export const enum MetodoEntrega {
  REPARTIDOR = 1,
}

export function transforPropToString(array, prop, names) {
  if (Array.isArray(array)) {
    array.forEach((element) => {
      const totrans = element[prop];
      if (totrans) {
        let toTranstr = '';
        names.forEach((name) => {
          if (totrans[name]) {
            toTranstr += totrans[name] + ' ';
          }
        });
        element[prop] = toTranstr.trimEnd();
      }
    });
  } else {
    const totrans = array[prop];
    if (totrans) {
      let toTranstr = '';
      names.forEach((name) => {
        if (totrans[name]) {
          toTranstr += totrans[name] + ' ';
        }
      });
      array[prop] = toTranstr.trimEnd();
    }
  }
}

export function transformArrayToString(array, prop) {
  array.forEach((element) => {
    const toTrans = element[prop].join(',');
    element[prop] = toTrans;
  });
}

/**
 * Filtro para la subida de imagenes
 * @param req
 * @param file
 * @param callback
 */
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|ico)$/)) {
    return callback(
      new HttpException(
        'Solo se permiten imagenes con formato .jpg, .jpeg .ico o .png',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};
