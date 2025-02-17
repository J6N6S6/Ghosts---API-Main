import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Categories')
export class Categories {
  @PrimaryColumn()
  id?: string;

  @Column({ default: null, nullable: true })
  image?: string;

  @Column({ default: null, nullable: true })
  title?: string;

  @Column({ default: null, nullable: true })
  description?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
