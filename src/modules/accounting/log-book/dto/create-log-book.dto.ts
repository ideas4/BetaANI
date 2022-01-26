export class CreateLogBookDto {
  fecha:Date;
  concepto:string;
  debe:number;
  haber:number;
  total:number;
  cuenta:any;
  usuario:any;
}
