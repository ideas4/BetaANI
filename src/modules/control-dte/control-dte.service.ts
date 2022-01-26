import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateControlDteDto } from './dto/create-control-dte.dto';
import { UpdateControlDteDto } from './dto/update-control-dte.dto';
import { ControlDte } from './entities/control-dte.entity';

@Injectable()
export class ControlDteService {
    constructor(
        @InjectRepository(ControlDte)
        private controlDteRepository: Repository<ControlDte>){}
    
    
    async create(dto: CreateControlDteDto){
        if(!await this.controlDteRepository.findOne({id: dto.id, lote: dto.lote})){ 
            return this.controlDteRepository.save(dto);
          }else{
           throw new HttpException('El control ya existe.',HttpStatus.NOT_ACCEPTABLE);
         }
    }

    findAll() {
        return this.controlDteRepository.find();
    }

    //PREGUNTAR SOBRE EL UPDATE
    async update(id: number, lote: number,  updateControlDte: UpdateControlDteDto) {
        return (await this.controlDteRepository.update(
            {
                id: id,
                lote: lote
            }, updateControlDte)).affected;
    }

    findOne(id: number, lote: number) {
        return this.controlDteRepository.findOne({id: id, lote: lote});
    }


}
