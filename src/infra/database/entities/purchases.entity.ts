import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Products } from './products.entity';
import { Users } from './users.entity';

@Entity()
export class Purchases {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column()
  product_id: string;

  @Column({ nullable: true, default: null })
  transaction_id?: string;

  @Column({ type: 'float', nullable: true, default: null })
  evaluation?: number;

  @Column('jsonb', { default: [] })
  watched_lessons?: {
    lesson_id: string;
    lesson_timestamp: number;
    lesson_completed: boolean;
  }[];

  @Column({ default: false })
  blocked_comments?: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  product?: Products;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user?: Users;
}
