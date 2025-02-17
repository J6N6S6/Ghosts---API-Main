import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Products } from './products.entity';
@Entity('Sections')
export class Sections {
  @PrimaryColumn()
  id?: string;

  @Column()
  title: string;

  @Column()
  package_id: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => Products, (products) => products.section, {
    onDelete: 'SET NULL',
  })
  products?: Products[];
}
