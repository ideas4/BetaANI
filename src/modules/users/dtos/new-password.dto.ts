import { IsDefined, IsNotEmpty } from 'class-validator';

export class NewPasswordDto{
  @IsDefined({message:'Debe ingresar la clave de confirmación'})
  key:string;

  @IsDefined({message:'Debe definir la nueva contraseña'})
  @IsNotEmpty({message:'Debe ingresar la nueva contraseña'})
  newPassword:string;

}