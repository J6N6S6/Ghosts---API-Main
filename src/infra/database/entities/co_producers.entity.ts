import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';
import { Products } from './products.entity';

@Entity('products_co_producers')
export class CoProducers {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column()
  product_id: string;

  @Column()
  commission?: number;

  @Column({
    default: null,
    nullable: true,
  })
  commission_orderbump?: number;

  @Column({
    default: false,
  })
  accepted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: null, nullable: true })
  joinedAt?: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user?: Users;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  product?: Products;
}
