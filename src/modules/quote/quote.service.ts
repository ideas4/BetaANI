import { Injectable } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuoteEntity } from './entities/quote.entity';
import { Repository } from 'typeorm';
import { ProductQuoteEntity } from './entities/product-quote.entity';
import { QuoteStatusEntity } from './entities/quote-status.entity';
import { QuoteTimeEntity } from './entities/quote-time.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { User } from '../users/entities/user.entity';
import { PdfGeneratorService } from '../../services/pdf-generator/pdf-generator.service';
import { SendMailService } from '../../services/mailer/send-mail.service';
import { QuoteClientEntity } from './entities/quote-client.entity';
import { CreateQuoteClientDto } from './dto/create-quote-client.dto';
import { InfoProductsDto } from '../inventory/dto/info-products.dto';
import { Product } from '../products/entities/product.entity';
import { EstadoCotizacion } from "../../constants";

@Injectable()
export class QuoteService {
  constructor(
    @InjectRepository(QuoteEntity) private repository: Repository<QuoteEntity>,
    @InjectRepository(QuoteClientEntity)
    private repositoryClient: Repository<QuoteClientEntity>,
    @InjectRepository(ProductQuoteEntity)
    private productsRepository: Repository<ProductQuoteEntity>,
    @InjectRepository(QuoteStatusEntity)
    private repositoryStatus: Repository<QuoteStatusEntity>,
    @InjectRepository(QuoteTimeEntity)
    private repositoryTime: Repository<QuoteTimeEntity>,
    @InjectRepository(Inventory)
    private repositoryInventory: Repository<Inventory>,
    @InjectRepository(User) private repositoryUser: Repository<User>,
    @InjectRepository(Product) private repositoryProduct: Repository<Product>,
    private pdfService: PdfGeneratorService,
    private sendmail: SendMailService,
  ) {}

  /**
   * Crear cotizacion
   * @param createQuoteDto
   * @param usuario_id
   */
  async create(createQuoteDto: CreateQuoteDto, usuario_id: string) {
    createQuoteDto.estado = 1;
    const result = await this.repository.save({
      ...createQuoteDto,
      fecha_creacion: new Date(),
      usuario: await this.repositoryUser.findOne(usuario_id),
    });
    for (const value of createQuoteDto.productos) {
      await this.productsRepository.save({
        ...value,
        cotizacion: result,
        cotizacion_cliente: null,
      });
    }
    if (createQuoteDto.clientQuoteId) {
      // ELIMINAR DE cotizacion de cliente
      await this.repositoryClient.delete(createQuoteDto.clientQuoteId);
    }
    //generar pdf
    await this.generatePdf(result.id);
    await this.repository.update(result.id, {
      url_pdf: 'CT-' + result.id + '.pdf',
    });
    return result;
  }

  /**
   * Crear cotizacion desde ecommerce
   * @param createQuoteDto
   * @param usuario_id
   */
  async createClient(createQuoteDto: CreateQuoteClientDto, usuario_id: string) {
    const result = await this.repositoryClient.save({
      ...createQuoteDto,
      fecha_creacion: new Date(),
      usuario: await this.repositoryUser.findOne(usuario_id),
    });
    const products = await this.findInfoProducts(createQuoteDto.productos);
    for (const value of products) {
      await this.productsRepository.save({
        ...value,
        cotizacion_cliente: result,
        descuento: 0,
        justificacion_descuento: '',
      });
    }
    return result;
  }

  /**
   * Obtener cotizaciones
   */
  async findAll() {
    const result: any[] = await this.repository.find({
      relations: ['usuario', 'estado', 'vigencia'],
    });
    result.forEach((value) => {
      value.usuario = value.usuario.nombre + ' ' + value.usuario.apellido;
    });
    return result;
  }

  /**
   * Obtener cotizaciones de clientes
   */
  async findAllClient() {
    const result: any[] = await this.repositoryClient.find();
    return result;
  }

  /**
   * Obtener estados de cotizaciones
   */
  findStatus() {
    return this.repositoryStatus.find();
  }

  /**
   * Obtener la vigencia de las cotizaciones
   */
  findTime() {
    return this.repositoryTime.find();
  }

  /**
   * Obtener el detalle de una cotizacion
   * @param id
   */
  async findOne(id: number) {
    const result: any = await this.repository.findOne(id, {
      relations: [
        'tipo_entrega',
        'estado',
        'vigencia',
        'metodo_pago',
        'usuario',
        'envio',
        'productos',
        'productos.producto',
      ],
    });
    result.usuario = result.usuario.nombre + ' ' + result.usuario.apellido;
    return result;
  }

  /**
   * Obtener el detalle de una cotizacion ingresada por un cliente
   * @param id
   */
  async findOneClient(id: number) {
    const result: any = await this.repositoryClient.findOne(id, {
      relations: ['productos', 'productos.producto'],
    });
    return result;
  }

  async updateStatus(id: string, id_status: string) {
    if (id_status.toString() == EstadoCotizacion.ENVIADA.toString()) {
      const quote: QuoteEntity = await this.findOne(+id);
      await this.sendmail.sendQuote(quote, 'CT-' + id + '.pdf');
    }
    return (
      await this.repository.update(id, {
        estado: await this.repositoryStatus.findOne(id_status),
      })
    ).affected;
  }

  /**
   * Generar PDF
   * @param id
   */
  async generatePdf(id: number) {
    const quote: QuoteEntity = await this.findOne(id);
    await this.pdfService
      .generateQuotePDF(quote, 'CT-' + id + '.pdf')
      .then()
      .catch((e) => {
        console.error(e);
      });
    return 'Ok';
  }

  /**
   * Obtener información para carrito según id y cantidad de body
   * @param body
   */
  async findInfoProducts(body: InfoProductsDto[]): Promise<any[]> {
    if (!body || !Array.isArray(body) || body.length <= 0) {
      return [];
    }
    const ids = [];
    body.forEach((element) => {
      ids.push(element.id);
    });
    const result = await this.repositoryProduct
      .createQueryBuilder('prod')
      .leftJoinAndSelect('prod.imagenes', 'imagenes')
      .where('prod.id IN (:values)', { values: ids })
      .orderBy({ 'imagenes.prioridad': 'ASC' })
      .getMany();
    const products: any[] = [];
    result.forEach((element) => {
      const obj = body.find((e) => e.id == element.id);
      if (obj) {
        products.push({
          cantidad: obj.cantidad,
          imagen: element.imagenes.length > 0 ? element.imagenes[0].url : '',
          nombre: element.nombre,
          precio: element.precio_venta,
          sku: element.sku,
          producto: element,
        });
      }
    });
    return products;
  }


  async filterDate(fechaStart: string, fechaEnd: string){
    return this.repository.query(`SELECT * FROM cotizacion WHERE CAST(fecha_creacion as Date) BETWEEN STR_TO_DATE('${fechaStart}', '%d-%m-%Y') AND STR_TO_DATE('${fechaEnd}', '%d-%m-%Y')`)
  }
}
