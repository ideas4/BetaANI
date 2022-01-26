import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetailBill } from './entities/detailBill.entity';

@Injectable()
export class DetailBillService {

    constructor(@InjectRepository (DetailBill)
    private detailBillRepository : Repository<DetailBill>){}

    async create(dto: DetailBill){
        return this.detailBillRepository.save(dto);
    }

    findAll() {
        return this.detailBillRepository.find();
    }

    findAny(tipo: number, serie: string, numero: string) {
        return this.detailBillRepository.find({tipo: tipo, serie:serie, numero:numero});
    }
}
