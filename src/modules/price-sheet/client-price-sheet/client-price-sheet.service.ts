import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateClientPriceSheetDto } from './dto/update-client-priceSheet.dto';
import { ClientPriceSheet } from './entities/client-priceSheet.entity';

@Injectable()
export class ClientPriceSheetService {
  constructor(
    @InjectRepository(ClientPriceSheet)
    private clientPriceSheetRepository: Repository<ClientPriceSheet>,
  ) {}

  async create(dto: ClientPriceSheet) {
    if (
      !(await this.clientPriceSheetRepository.findOne({
        hojaId: dto.hojaId,
        clienteId: dto.clienteId,
      }))
    ) {
      dto['fecha_asignacion'] = new Date();
      return this.clientPriceSheetRepository.save(dto);
    } else {
      throw new HttpException(
        'La hoja de precios ya existe.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  findAll() {
    return this.clientPriceSheetRepository.find();
  }

  async update(
    id: number,
    clientId: number,
    updateclientPriceSheetDto: UpdateClientPriceSheetDto,
  ) {
    return (
      await this.clientPriceSheetRepository.update(
        {
          hojaId: id,
          clienteId: clientId,
        },
        updateclientPriceSheetDto,
      )
    ).affected;
  }

  findOne(id: number, clientId: number) {
    return this.clientPriceSheetRepository.findOne({
      hojaId: id,
      clienteId: clientId,
    });
  }

  findClient(id: number) {
    return this.clientPriceSheetRepository.findOne({ clienteId: id });
  }

  findAllClient() {
    let query =
      'SELECT * FROM cliente LEFT OUTER JOIN cliente_hojaprecio ON cliente.id = cliente_hojaprecio.clienteId;';
    console.log('nuevo filtro.');
    return this.clientPriceSheetRepository.query(query);
  }

  findAllSheet(id: number) {
    let query = `SELECT * FROM cliente t1
    INNER JOIN cliente_hojaprecio t2  ON t1.id = t2.clienteId WHERE t2.hojaId = ${id}`;
    return this.clientPriceSheetRepository.query(query);
  }

  findSheetClient(id: number) {
    let query = `SELECT  a.hojaId, b.nombre, b.fecha_inicio, b.fecha_final from cliente_hojaprecio as a
                  inner join encabezado_hp as b ON a.hojaId = b.id
                  WHERE a.clienteId = ${id} AND b.tipo = '1'
                  AND CURDATE() BETWEEN b.fecha_inicio AND b.fecha_final
                  order by fecha_inicio limit 1;`;
    return this.clientPriceSheetRepository.query(query);
  }

  async remove(idHoja: number, idCliente: number) {
    return (
      await this.clientPriceSheetRepository.delete({
        hojaId: idHoja,
        clienteId: idCliente,
      })
    ).affected;
  }
}
