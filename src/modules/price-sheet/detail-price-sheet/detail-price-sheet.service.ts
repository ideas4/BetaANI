import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateDetailPriceSheet } from './dto/update-detail-price-sheet.dto';
import { DetailPriceSheet } from './entities/detail-price-sheet.entity';

@Injectable()
export class DetailPriceSheetService {
  constructor(
    @InjectRepository(DetailPriceSheet)
    private detailPriceSheetRepository: Repository<DetailPriceSheet>,
  ) {}

  async create(dto: DetailPriceSheet) {
    if (
      !(await this.detailPriceSheetRepository.findOne({
        hojaId: dto.hojaId,
        articuloId: dto.articuloId,
      }))
    ) {
      return this.detailPriceSheetRepository.save(dto);
    } else {
      throw new HttpException(
        'El producto ya existe en la hoja de precios.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  findAll() {
    return this.detailPriceSheetRepository.find();
  }

  async update(
    hojaPrecio_id: number,
    articulo_id: number,
    updateDetailPriceSheetDto: UpdateDetailPriceSheet,
  ) {
    return (
      await this.detailPriceSheetRepository.update(
        {
          hojaId: hojaPrecio_id,
          articuloId: articulo_id,
        },
        updateDetailPriceSheetDto,
      )
    ).affected;
  }

  findOne(hojaId: number, articuloId: number) {
    return this.detailPriceSheetRepository.findOne({
      hojaId: hojaId,
      articuloId: articuloId,
    });
  }

  findOneSheet(hojaId: number) {
    return this.detailPriceSheetRepository.query(
      `SELECT * FROM detalle_hp WHERE hojaId LIKE ${hojaId}`,
    );
  }

  async remove(hojaId: number, articuloId: number) {
    return (
      await this.detailPriceSheetRepository.delete({
        hojaId: hojaId,
        articuloId: articuloId,
      })
    ).affected;
  }

  async removeSheet(hojaId: number) {
    return (
      await this.detailPriceSheetRepository.delete({
        hojaId: hojaId,
      })
    ).affected;
  }
}
