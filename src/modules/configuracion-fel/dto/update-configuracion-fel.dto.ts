import { PartialType } from "@nestjs/mapped-types";
import { CreateConfigDto } from "src/modules/configurations/config-admin/dto/create-config.dto";
import { CreateConfiguracionFelDto } from "./create-configuracion-fel.dto";


export class UpdateConfiguracionFelDto extends PartialType(CreateConfiguracionFelDto){}