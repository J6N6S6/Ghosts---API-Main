import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Products } from './products.entity';

@Entity('products_content')
export class ProductsContentEntity {
  @PrimaryColumn()
  id?: string;

  @Column()
  product_id: string;

  @Column()
  title: string;

  @Column({
    enum: ['link', 'file'],
  })
  type: string;

  @Column()
  content: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: null,
  })
  file_details: {
    name: string;
    size: number;
    type: string;
  } | null;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @ManyToOne(() => Products, (product) => product.content)
  @JoinColumn({ name: 'product_id' })
  product?: Products;
}
