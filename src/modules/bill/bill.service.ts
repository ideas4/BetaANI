import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bill } from './entities/bill.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBillDto } from './dto/update-bill.dto';
import { PdfGeneratorService } from 'src/services/pdf-generator/pdf-generator.service';
import { SendMailService } from 'src/services/mailer/send-mail.service';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
    private pdfServices: PdfGeneratorService,
    private sendmails: SendMailService,
  ) {}

  async create(dto: CreateBillDto) {
    // return this.billRepository.save(dto);
    if (
      !(await this.billRepository.findOne({
        tipo: dto.tipo,
        serie: dto.serie,
        numero: dto.numero,
      }))
    ) {
      return this.billRepository.save(dto);
    } else {
      throw new HttpException(
        'La factura ya existe.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  findAll() {
    return this.billRepository.find();
  }

  async update(
    tipo: number,
    serie: string,
    numero: string,
    updateBilldto: UpdateBillDto,
  ) {
    return (
      await this.billRepository.update(
        {
          tipo: tipo,
          serie: serie,
          numero: numero,
        },
        updateBilldto,
      )
    ).affected;
  }

  //SE REALIZA UNA BUSQUEDA POR MEDIO DE LOS TRES LLAVES PRIMARIAS
  findOne(tipo: number, serie: string, numero: string) {
    return this.billRepository.findOne({
      tipo: tipo,
      serie: serie,
      numero: numero,
    });
  }

  async filterDate(fechaStart: string, fechaEnd: string) {
    return this.billRepository.query(
      `SELECT * FROM encabezado_factura WHERE CAST(fecha as Date) BETWEEN STR_TO_DATE('${fechaStart}', '%d-%m-%Y') AND STR_TO_DATE('${fechaEnd}', '%d-%m-%Y')`,
    );
  }

  async createPdfAndSend(
    nit: string,
    nombre: string,
    direccion: string,
    correo: string,
    detalle: any,
    dte: string,
    fecha: string,
    serie: string,
    numero: string,
    fecha_certificado: string,
  ) {
    this.pdfServices.generateBillPdf(
      nit,
      nombre,
      direccion,
      correo,
      detalle,
      dte,
      serie,
      numero,
      fecha_certificado,
    );
    this.sendmails.sendBill(correo, nombre, dte, fecha, serie);
  }

  async listBillsActive() {
    return this.billRepository
      .query(`select tipo, serie, numero, dte, fecha_certificacion, fecha, nit_cliente, razonsocial_cliente, estado from encabezado_factura where encabezado_factura.estado = 1;
    `);
  }

  async listBillsCancel() {
    return this.billRepository.query(`
    select tipo, serie, numero, dte, fecha_anulacion, nit_cliente, razonsocial_cliente, estado from encabezado_factura where encabezado_factura.estado = 0;`);
  }
}
