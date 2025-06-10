import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Transactions } from './transactions.entity';

@Entity('user_secure_reserve_transactions')
export class UserSecureReserveTransactionsEntity {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column({
    nullable: true,
    default: null,
  })
  original_transaction_id?: string;

  @Column({
    nullable: true,
    default: null,
  })
  reference_id?: string;

  @Column({
    enum: ['in_reserve', 'chargeback', 'liquidated'],
  })
  status: 'in_reserve' | 'chargeback' | 'liquidated';

  @Column({
    type: 'float',
  })
  value: number;

  @Column({ type: 'float', default: 0 })
  total_amount_reserved: number;

  @Column({
    enum: ['income', 'expense'],
  })
  operation_type: 'income' | 'expense';

  @Column({ type: 'float', default: 0 })
  old_total_amount_reserved: number;

  @Column({ nullable: true, default: null })
  liquidation_date?: Date | null;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @ManyToOne(() => Transactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'reference_id' })
  transaction?: Transactions;
}
