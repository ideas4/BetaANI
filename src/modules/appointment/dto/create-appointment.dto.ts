export class CreateAppointmentDto {
  title: string;
  description: string;
  start: Date;
  end: Date;
  idTipoCita: number;
  idCliente: number;
}
