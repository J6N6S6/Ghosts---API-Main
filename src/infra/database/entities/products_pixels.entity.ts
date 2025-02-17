import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Products } from './products.entity';
import { Users } from './users.entity';

@Entity('products_pixel')
export class ProductsPixel {
  @PrimaryColumn()
  id?: string;

  @Column()
  type: 'FACEBOOK' | 'GOOGLE' | 'TIKTOK' | 'KWAI';

  @Column()
  product_id: string;

  @Column({
    nullable: true,
    default: null,
  })
  user_id: string;

  @Column({ nullable: true })
  title?: string;

  @Column()
  content: string;

  @Column({
    nullable: true,
    default: null,
  })
  token?: string;

  @Column({ default: true })
  active?: boolean;

  @Column({ default: false })
  purchase_event_pix?: boolean;

  @Column({ default: false })
  purchase_event_bank_slip?: boolean;

  @Column({ nullable: true, default: null })
  domain?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @ManyToOne(() => Products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product?: Products;

  @ManyToOne(() => Users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: Users;
}
