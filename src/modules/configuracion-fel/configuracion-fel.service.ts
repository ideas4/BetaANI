import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConfigDto } from '../configurations/config-admin/dto/create-config.dto';
import { CreateConfiguracionFelDto } from './dto/create-configuracion-fel.dto';
import { UpdateConfiguracionFelDto } from './dto/update-configuracion-fel.dto';
import { ConfiguracionFel } from './entities/configuracion-fel.entity';

@Injectable()
export class ConfiguracionFelService {
    constructor(
        @InjectRepository(ConfiguracionFel)
        private configFelRepository: Repository<ConfiguracionFel>){}


        async create(dto: CreateConfiguracionFelDto){
            if(!await this.configFelRepository.findOne({id: dto.id})){ 
                return this.configFelRepository.save(dto);
              }else{
               throw new HttpException('La configuracion ya existe.',HttpStatus.NOT_ACCEPTABLE);
             }
        }
    
        findAll() {
            return this.configFelRepository.find();
        }
    
        //PREGUNTAR SOBRE EL UPDATE
        async update(id: number, updateConfiguracionFel: UpdateConfiguracionFelDto) {
            return (await this.configFelRepository.update(
                {
                    id: id
                }, updateConfiguracionFel)).affected;
        }
    
        findOne(id: number) {
            return this.configFelRepository.findOne({id: id});
        }

}
