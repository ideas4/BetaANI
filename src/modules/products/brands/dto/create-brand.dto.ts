import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
    @IsNotEmpty({message:'El nombre es requerido'})
    nombre:string;
}
