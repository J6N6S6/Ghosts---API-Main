import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserBankingTransactions } from './user_banking_transactions.entity';
import { Users } from './users.entity';

@Entity('withdrawals')
export class Withdrawals {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column({
    type: 'float',
  })
  amount: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  reason?: string;

  @Column({ nullable: true })
  approved_by?: string;

  @Column({
    type: 'jsonb',
    default: {},
  })
  bank_account?: {
    pix_key: string;
    pix_type: string;
    is_corporate: boolean;
    bank_name: string;
    bank_agency: string;
    bank_account: string;
    bank_account_type: 'CC' | 'CP';
  };

  @Column()
  transaction_id?: string;

  @Column({ nullable: true })
  approved_at?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user?: Users;

  @ManyToOne(() => Users, {
    nullable: true,
  })
  @JoinColumn({ name: 'approved_by' })
  approvedBy?: Users;

  @ManyToOne(() => UserBankingTransactions, (transaction) => transaction.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction?: UserBankingTransactions;
}
