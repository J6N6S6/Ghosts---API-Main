import { VouchersDiscountType } from '@/shared/@types/vouchers/vouchers.type';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Vouchers {
  @PrimaryColumn()
  id?: string;

  @Column()
  product_id: string;

  @Column()
  code: string;

  @Column({ type: 'enum', enum: VouchersDiscountType })
  discount_type: VouchersDiscountType;

  @Column()
  discount: number;

  @Column({ nullable: true })
  deadline: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;
}
