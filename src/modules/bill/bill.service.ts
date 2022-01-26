import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bill } from './entities/bill.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBillDto } from './dto/update-bill.dto';

@Injectable()
export class BillService {
    constructor(
        @InjectRepository (Bill)
        private billRepository : Repository<Bill>){}


    async create(dto: CreateBillDto){
        // return this.billRepository.save(dto);
        if(!await this.billRepository.findOne({tipo: dto.tipo, serie: dto.serie, numero: dto.numero})){ 
            return this.billRepository.save(dto);
          }else{
           throw new HttpException('La factura ya existe.',HttpStatus.NOT_ACCEPTABLE);
         }
    }


    findAll() {
        return this.billRepository.find();
    }


    async update(tipo: number, serie: string, numero: string,  updateBilldto: UpdateBillDto) {
            return (await this.billRepository.update(
                {
                    tipo: tipo,
                    serie: serie,
                    numero: numero
                }, updateBilldto)).affected;
    }

    //SE REALIZA UNA BUSQUEDA POR MEDIO DE LOS TRES LLAVES PRIMARIAS
    findOne(tipo: number, serie: string, numero: string) {
        return this.billRepository.findOne({tipo: tipo, serie:serie, numero:numero});
    }


    async filterDate(fechaStart: string, fechaEnd: string){
        return  this.billRepository.query(`SELECT * FROM encabezado_factura WHERE CAST(fecha as Date) BETWEEN STR_TO_DATE('${fechaStart}', '%d-%m-%Y') AND STR_TO_DATE('${fechaEnd}', '%d-%m-%Y')`)
    }
    
    
}
