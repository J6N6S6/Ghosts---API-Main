import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Products } from './products.entity';

@Entity('products_link')
export class ProductsLinks {
  @PrimaryColumn()
  id?: string;

  @Column()
  product_id: string;

  @Column()
  short_id: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'float' })
  price?: number;

  @Column({ default: 'active' })
  status?: string;

  @Column()
  type: string;

  @Column({
    default: false,
  })
  allow_affiliation?: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @ManyToOne(() => Products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product?: Products;
}
