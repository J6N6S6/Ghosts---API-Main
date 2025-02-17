import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Transactions } from './transactions.entity';

@Entity('transactions_buyers')
export class TransactionsBuyers {
  @PrimaryColumn()
  id?: string;

  @Column()
  visitor_id?: string;

  @Column()
  product_id: string;

  @Column({ nullable: true, default: null })
  affiliate_id?: string;

  @Column({ nullable: true, default: null })
  name?: string;

  @Column({ nullable: true, default: null })
  email?: string;

  @Column({ nullable: true, default: null })
  phone?: string;

  @Column({ nullable: true, default: null })
  document?: string;

  @Column({ type: 'jsonb', default: '{}' })
  address?: {
    cep?: string;
    city?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    state?: string;
  };

  @Column()
  payment_method: string;

  @Column({ nullable: true, default: null })
  birth_date?: string;

  @Column({ nullable: true, default: null })
  utm_source?: string;

  @Column({ nullable: true, default: null })
  utm_medium?: string;

  @Column({ nullable: true, default: null })
  utm_campaign?: string;

  @Column({ nullable: true, default: null })
  utm_term?: string;

  @Column({ nullable: true, default: null })
  utm_content?: string;

  @Column({ nullable: true, default: null })
  transaction_id?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @OneToOne(() => Transactions, (transaction) => transaction.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'transaction_id' })
  Transaction?: Transactions;
}
