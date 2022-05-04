import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cuentas_contables' })
export class LedgerAccounts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cuenta' })
  cuenta: string;

  @Column({ name: 'nombre_cuenta' })
  nombre_cuenta: string;

  @Column({ name: 'clasificacion' })
  clasificacion: string;

  @Column({ name: 'descripcion', type: 'longtext', nullable: true })
  descripcion: string;
}
