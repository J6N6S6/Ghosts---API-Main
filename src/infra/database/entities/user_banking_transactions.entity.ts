import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Transactions } from './transactions.entity';

@Entity('user_banking_transactions')
export class UserBankingTransactions {
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
    enum: [
      'deposit',
      'withdrawal',
      'transfer',
      'payment',
      'refund',
      'chargeback',
      'sale',
      'liquidation',
    ],
  })
  transaction_type:
    | 'deposit'
    | 'withdrawal'
    | 'transfer'
    | 'payment'
    | 'refund'
    | 'chargeback'
    | 'penality'
    | 'sale'
    | 'liquidation';

  @Column({
    enum: ['income', 'expense'],
  })
  operation_type: 'income' | 'expense';

  @Column({
    type: 'jsonb',
    default: '[]',
  })
  discounts: {
    type: string;
    name: string;
    amount: number;
  }[];

  @Column({
    type: 'float',
  })
  value: number;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @Column({ type: 'float', default: 0 })
  old_balance: number;

  @Column({ type: 'jsonb', default: '{}' })
  extra_data?: any;

  @Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
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
