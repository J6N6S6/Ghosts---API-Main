import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Products } from './products.entity';
import { Users } from './users.entity';

@Entity('products_affiliates')
@Index(['product_id', 'user_id'], { unique: true })
export class ProductsAffiliates {
  @PrimaryColumn()
  id?: string;

  @Column()
  product_id: string;

  @Column()
  user_id: string;

  @Column({
    default: 'PENDING',
  })
  status?: string;

  @Column({ default: false })
  blocked?: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user?: Users;

  @ManyToOne(() => Products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product?: Products;
}
