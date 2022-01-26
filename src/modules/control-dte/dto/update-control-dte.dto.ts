import { PartialType } from "@nestjs/mapped-types";
import { CreateControlDteDto } from "./create-control-dte.dto";

export class UpdateControlDteDto extends PartialType(CreateControlDteDto){}