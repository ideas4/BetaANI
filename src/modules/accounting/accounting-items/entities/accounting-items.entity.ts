import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'partida' })
export class AccountingItems {
  @PrimaryColumn({ name: 'codigo' })
  codigo: string;

  @Column({ name: 'nombre' })
  nombre: string;

  @Column({ name: 'descripcion' })
  descripcion: string;

  @Column({ name: 'tipo_partida' })
  tipo_partida: number;
}
