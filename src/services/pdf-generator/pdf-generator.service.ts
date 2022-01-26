/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import * as PdfMake from 'pdfmake';
import * as fs from 'fs';
import * as moment from 'moment';
import * as axios from 'axios';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM('');
const htmlToPdfMake = require('html-to-pdfmake');

import { ConfigService } from '../../modules/configurations/config-admin/config.service';
import { QuoteEntity } from '../../modules/quote/entities/quote.entity';

const fonts = {
  Roboto: {
    normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
    bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
    italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
    bolditalics:
      'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf',
  },
};

@Injectable()
export class PdfGeneratorService {
  private info: {
    logo: string;
    nombre: string;
    direccion: string;
    telefono: string;
    correo: string;
  } = {
    telefono: '',
    correo: '',
    direccion: '',
    nombre: '',
    logo: '',
  };
  private default_product_image = 'assets/img/empty.png';
  private default_logo = 'assets/img/logo.png';

  constructor(private configService: ConfigService) {}

  /**
   * Get config from database
   */
  async refreshConfiguration() {
    const config = await this.configService.findOne();
    const configEcommerce = await this.configService.findEcommerce();
    this.info.logo = config.url_imagenes + 'config/' + configEcommerce.logo;
    this.info.nombre = configEcommerce.nombre;
    this.info.direccion = configEcommerce.direccion;
    this.info.telefono = configEcommerce.telefono;
    this.info.correo = configEcommerce.correo_electronico;
  }

  /**
   * Generar orden
   * @param order
   * @param products
   * @param total
   */
  async genOrder(order: any, products: any, total: number) {
    await this.refreshConfiguration();
    const image = await this.getImageFromURL(this.info.logo, this.default_logo);

    const docDefinition = {
      content: [
        {
          style: 'superHeader',
          columns: [
            {
              width: '50%',
              image: image,
              fit: [150, 150],
            },
            [
              {
                text: this.info.nombre,
                alignment: 'right',
              },
              {
                text: this.info.direccion,
                alignment: 'right',
              },
              {
                text: this.info.correo,
                alignment: 'right',
              },
              {
                text: this.info.telefono,
                alignment: 'right',
              },
            ],
          ],
        },
        { text: 'Pedido de Producto', style: ['header'] },
        //INFORMACION
        {
          columns: [
            //CLIENTE
            [
              { text: 'Cliente', style: 'subheader' },
              {
                style: 'table',
                layout: 'noBorders',
                table: {
                  widths: ['auto', '*'],
                  headerRows: 1,
                  body: [
                    ['Cliente', order.cliente],
                    ['Dirección', order.direccion],
                    ['Teléfono', order.telefono],
                    ['Email', order.email],
                    ['NIT', order.nit_cliente],
                  ],
                },
              },
            ],
            //ORDEN
            [
              { text: 'Orden No.' + order.id, style: 'subheader' },
              {
                style: 'table',
                layout: 'noBorders',
                table: {
                  widths: ['auto', '*'],
                  headerRows: 1,
                  body: [
                    ['No. Guia', order.no_guia],
                    ['No. Factura', order.no_factura],
                    [
                      'Fecha de Ingreso',
                      moment(order.fecha_creacion).format(
                        'DD/MM/YY, h:mm:ss a',
                      ),
                    ],
                    [
                      'Fecha de Entrega',
                      moment(order.fecha_entrega).format('DD/MM/YY'),
                    ],
                    ['Vendedor', order.vendedor],
                    ['Entrega', order.entrega],
                    ['Método de Pago', order.m_pago],
                    ['Estado', order.estado],
                  ],
                },
              },
            ],
          ],
        },
        //DETALLE DE ORDEN
        { text: 'Detalle de Orden', style: 'subheader' },
        //tabla
        {
          style: 'table',
          layout: {
            hLineWidth: function (i, node) {
              if (i === 0 || i === node.table.body.length) {
                return 0;
              }
              return i === node.table.headerRows ? 2 : 1;
            },
            vLineWidth: function (i) {
              return 0;
            },
            hLineColor: function (i) {
              return i === 1 ? 'black' : '#aaa';
            },
            paddingLeft: function (i) {
              return i === 0 ? 0 : 8;
            },
            paddingRight: function (i, node) {
              return i === node.table.widths.length - 1 ? 0 : 8;
            },
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex % 2 != 0 &&
                rowIndex > 0 &&
                rowIndex < products.length
                ? '#dee0e3'
                : null;
            },
          },
          table: {
            widths: ['*', 'auto', '*', 'auto', '*', 'auto', '*'],
            headerRows: 1,
            body: [
              [
                '#',
                'Código',
                'Producto',
                'Precio',
                'Descuento',
                'Cantidad',
                'Sub-Total',
              ],
              ...products,
              [
                { text: 'Total', bold: true },
                '',
                '',
                '',
                '',
                '',
                { text: 'Q.' + total.toFixed(2), bold: true },
              ],
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 10],
        },
        table1: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };
    //Generar Documento
    PdfGeneratorService.generatePDF(docDefinition, 'orden.pdf');
  }

  /**
   * Generar Cotizacion
   * @param quote
   * @param products
   * @param total
   * @param nombre
   */
  async generateQuotePDF(quote: QuoteEntity, nombre: string) {
    await this.refreshConfiguration();
    const encabezado = htmlToPdfMake(quote.encabezado_pagina, {
      window: window,
    });
    const terminos = htmlToPdfMake(quote.condiciones, { window: window });
    const pago = htmlToPdfMake(quote.terminos_pago, { window: window });
    const garantia = htmlToPdfMake(quote.garantia, { window: window });
    const footer = htmlToPdfMake(quote.pie_pagina, { window: window });
    const image = await this.getImageFromURL(this.info.logo, this.default_logo);
    const { total, products } = await this.getFormatedDataQuote(quote);

    const docDefinition = {
      content: [
        {
          style: 'superHeader',
          columns: [
            {
              width: '50%',
              image: image,
              fit: [150, 150],
            },
            [
              {
                text: this.info.nombre,
                alignment: 'right',
              },
              {
                text: this.info.direccion,
                alignment: 'right',
              },
              {
                text: this.info.correo,
                alignment: 'right',
              },
              {
                text: this.info.telefono,
                alignment: 'right',
              },
              {
                text: moment().format('DD/MM/YY, h:mm:ss a'),
                alignment: 'right',
              },
            ],
          ],
        },
        { text: 'Cotización', style: ['header'] },
        ...encabezado,
        //{ text: quote.encabezado_pagina, style: ['header_text'] },
        //INFORMACION
        {
          columns: [
            //CLIENTE
            [
              { text: 'Cliente', style: 'subheader' },
              {
                style: 'table',
                layout: 'noBorders',
                table: {
                  widths: ['auto', '*'],
                  headerRows: 1,
                  body: [
                    ['Cliente', quote.cliente],
                    ['Dirección', quote.direccion],
                    ['Teléfono', quote.telefono],
                    ['Email', quote.email],
                    ['NIT', quote.nit_cliente],
                  ],
                },
              },
            ],
            //ORDEN
            [
              { text: 'Cotización No.' + quote.id, style: 'subheader' },
              {
                style: 'table',
                layout: 'noBorders',
                table: {
                  widths: ['auto', '*'],
                  headerRows: 1,
                  body: [
                    [
                      'Fecha de Ingreso',
                      moment(quote.fecha_creacion).format(
                        'DD/MM/YY, h:mm:ss a',
                      ),
                    ],
                    ['Vendedor', quote.usuario],
                    [
                      'Entrega',
                      quote.tipo_entrega
                        ? quote.tipo_entrega.nombre
                        : 'No definido',
                    ],
                    [
                      'Método de Pago',
                      quote.metodo_pago
                        ? quote.metodo_pago.nombre
                        : 'No definido',
                    ],
                    [
                      'Estado',
                      quote.estado ? quote.estado.nombre : 'No definido',
                    ],
                    ['Vigencia', quote.vigencia ? quote.vigencia.nombre : ''],
                    [
                      'Envío a ',
                      quote.envio ? quote.envio.nombre : 'No definido',
                    ],
                  ],
                },
              },
            ],
          ],
        },
        //DETALLE DE ORDEN
        { text: 'Detalle de Cotización', style: 'subheader' },
        //tabla
        {
          style: 'table',
          layout: {
            hLineWidth: function (i, node) {
              if (i === 0 || i === node.table.body.length) {
                return 0;
              }
              return i === node.table.headerRows ? 2 : 1;
            },
            vLineWidth: function (i) {
              return 0;
            },
            hLineColor: function (i) {
              return i === 1 ? 'black' : '#aaa';
            },
            paddingLeft: function (i) {
              return i === 0 ? 0 : 8;
            },
            paddingRight: function (i, node) {
              return i === node.table.widths.length - 1 ? 0 : 8;
            },
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex % 2 != 0 &&
                rowIndex > 0 &&
                rowIndex < products.length
                ? '#dee0e3'
                : null;
            },
          },
          table: {
            widths: [
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              '*',
            ],
            headerRows: 1,
            body: [
              [
                '#',
                'Imagen',
                'Código',
                'Producto',
                'Precio',
                'Descuento',
                'Cantidad',
                'Sub-Total',
              ],
              ...products,
              [
                { text: 'Envío', bold: true },
                '',
                '',
                '',
                '',
                '',
                '',
                {
                  text: quote.envio ? 'Q.' + quote.envio.costo.toFixed(2) : '-',
                  bold: true,
                },
              ],
              [
                { text: 'Total', bold: true },
                '',
                '',
                '',
                '',
                '',
                '',
                { text: 'Q.' + total.toFixed(2), bold: true },
              ],
            ],
          },
        },
        //TERMINOS Y CONDICIONES
        { text: 'Términos y Condiciones', style: 'subheader_left' },
        ...terminos,
        //TERMINOS DE PAGO
        { text: 'Términos de Pago', style: 'subheader_left' },
        ...pago,
        //GARANTIA
        { text: 'Términos de Garantía', style: 'subheader_left' },
        ...garantia,
        //PIE DE PAGINA
        ...footer,
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 10],
        },
        subheader_left: {
          fontSize: 13,
          bold: true,
          alignment: 'left',
          margin: [0, 10, 0, 10],
        },
        table1: {
          margin: [0, 5, 0, 15],
        },
        header_text: {
          margin: [0, 0, 0, 20],
        },
        footer: {
          margin: [1, 50, 0, 0],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };
    //Generar Documento
    PdfGeneratorService.generatePDF(docDefinition, nombre);
  }

  /**
   * Generar documento de movimiento de inventario
   * @param values
   * @param nombre
   */
  async genMovement(values: any[], nombre: string) {
    await this.refreshConfiguration();
    const image = await this.getImageFromURL(this.info.logo, this.default_logo);
    const docDefinition = {
      content: [
        {
          style: 'superHeader',
          columns: [
            {
              width: '50%',
              image: image,
              fit: [150, 150],
            },
            [
              {
                text: this.info.nombre,
                alignment: 'right',
              },
              {
                text: this.info.direccion,
                alignment: 'right',
              },
              {
                text: this.info.correo,
                alignment: 'right',
              },
              {
                text: this.info.telefono,
                alignment: 'right',
              },
            ],
          ],
        },
        { text: 'Movimiento de Inventario', style: ['header'] },
        //tabla
        {
          style: 'table',
          layout: {
            hLineWidth: function (i, node) {
              if (i === 0 || i === node.table.body.length) {
                return 0;
              }
              return i === node.table.headerRows ? 2 : 1;
            },
            vLineWidth: function (i) {
              return 0;
            },
            hLineColor: function (i) {
              return i === 1 ? 'black' : '#aaa';
            },
            paddingLeft: function (i) {
              return i === 0 ? 0 : 8;
            },
            paddingRight: function (i, node) {
              return i === node.table.widths.length - 1 ? 0 : 8;
            },
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex % 2 != 0 &&
                rowIndex > 0 &&
                rowIndex < values.length
                ? '#dee0e3'
                : null;
            },
          },
          table: {
            widths: ['*', 'auto', '*', 'auto', '*', 'auto', '*'],
            headerRows: 1,
            body: [
              [
                'Fecha y Hora',
                'Usuario',
                'SKU Producto',
                'Producto',
                'Sucursal ',
                'Descripción',
                'Cantidad',
              ],
              ...values,
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 10],
        },
        table1: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };
    //Generar Documento
    PdfGeneratorService.generatePDF(docDefinition, nombre);
  }

  /**
   * Generar prueba
   */
  async genPDFtest() {
    await this.refreshConfiguration();
    const image = await this.getImageFromURL(this.info.logo, this.default_logo);
    const docDefinition = {
      content: [
        {
          style: 'superHeader',
          columns: [
            {
              width: '50%',
              image: image,
              fit: [150, 150],
            },
            [
              {
                text: this.info.nombre,
                alignment: 'right',
              },
              {
                text: this.info.direccion,
                alignment: 'right',
              },
              {
                text: this.info.correo,
                alignment: 'right',
              },
              {
                text: this.info.telefono,
                alignment: 'right',
              },
            ],
          ],
        },
        { text: 'Movimiento de Inventario', style: ['header'] },
        //tabla
        {
          style: 'table',
          layout: {
            hLineWidth: function (i, node) {
              if (i === 0 || i === node.table.body.length) {
                return 0;
              }
              return i === node.table.headerRows ? 2 : 1;
            },
            vLineWidth: function (i) {
              return 0;
            },
            hLineColor: function (i) {
              return i === 1 ? 'black' : '#aaa';
            },
            paddingLeft: function (i) {
              return i === 0 ? 0 : 8;
            },
            paddingRight: function (i, node) {
              return i === node.table.widths.length - 1 ? 0 : 8;
            },
            fillColor: function (rowIndex) {
              return rowIndex % 2 != 0 && rowIndex > 0 && rowIndex < 0
                ? '#dee0e3'
                : null;
            },
          },
          table: {
            widths: ['*', 'auto', '*', 'auto', '*', 'auto', '*'],
            headerRows: 1,
            body: [
              [
                'Fecha y Hora',
                'Usuario',
                'SKU Producto',
                'Producto',
                'Sucursal ',
                'Descripción',
                'Cantidad',
              ],
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 10, 0, 10],
        },
        table1: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };
    //Generar Documento
    PdfGeneratorService.generatePDF(docDefinition, 'test.pdf');
  }

  private static generatePDF(docDefinition, path) {
    const doc = new PdfMake(fonts).createPdfKitDocument(docDefinition);
    doc.pipe(fs.createWriteStream('uploads/docs/' + path));
    doc.end();
  }

  /**
   * Get buffer of an image to insert on PDF
   * @param path
   * @param defaultPath should be a local asset path
   * @private
   */
  private async getImageFromURL(path: string, defaultPath: string) {
    return await axios.default
      .get(path, {
        responseType: 'arraybuffer',
      })
      .then((response) => Buffer.from(response.data, 'base64'))
      .catch(() => defaultPath);
  }

  /**
   * Get formated data for generate Quote PDF
   * @param quote
   * @private
   */
  private async getFormatedDataQuote(quote: QuoteEntity | any) {
    //formar arreglo de datos de la orden en un arreglo de valores para concatenar
    const array = [];
    let contador = 1;
    let total = quote.envio ? quote.envio.costo : 0;
    for (const element of quote.productos) {
      const subtotal = element.cantidad * element.precio - element.descuento;
      let image = null;
      if (element.imagen && element.imagen !== '') {
        image = await this.getImageFromURL(
          element.imagen,
          this.default_product_image,
        );
      } else {
        image = this.default_product_image;
      }
      array.push([
        contador,
        {
          width: '50%',
          image: image,
          fit: [50, 50],
        },
        element.producto.sku,
        element.producto.nombre,
        'Q.' + element.precio.toFixed(2),
        'Q.' + element.descuento.toFixed(2),
        element.cantidad,
        'Q.' + subtotal.toFixed(2),
      ]);
      contador++;
      total += subtotal;
    }
    return {
      total,
      products: array,
    };
  }
}
