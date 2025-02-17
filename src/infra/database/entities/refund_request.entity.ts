import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Transactions } from './transactions.entity';

@Entity('refund_request')
export class RefundRequestEntity {
  @PrimaryColumn()
  id?: string;

  @Column()
  buyer_name: string;

  @Column()
  transaction_email: string;

  @Column()
  buyer_document: string;

  @Column()
  buyer_phone: string;

  @Column()
  transaction_id: string;

  @Column({ nullable: true })
  pix_key: string;

  @Column()
  reason: string;

  @Column()
  status: 'CONCLUDED' | 'WAITING_REFUND_PAYMENT' | 'PENDING' | 'REJECTED';

  @OneToOne(() => Transactions, (transaction) => transaction.id)
  @JoinColumn({ name: 'transaction_id' })
  transaction?: Transactions;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}
