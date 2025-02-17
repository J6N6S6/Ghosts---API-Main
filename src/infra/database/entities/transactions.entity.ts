import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Products } from './products.entity';
import { TransactionsBuyers } from './transactions_buyers.entity';
import { Users } from './users.entity';

@Entity('transactions')
export class Transactions {
  @PrimaryColumn()
  id: string;

  @Column({
    nullable: true,
  })
  external_id?: string;

  @Column()
  seller_id: string;

  @Column()
  payment_method: string;

  @Column()
  status: string;

  @Column()
  product_id: string;

  @Column({
    nullable: true,
  })
  product_link?: string;

  @Column({
    type: 'jsonb',
    default: '[]',
  })
  additional_products?: {
    product_id: string;
    unit_price: number;
  }[];

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  payer?: {
    email: string;
    document: string;
    name?: string;
    phone?: string;
  };

  @Column({
    type: 'jsonb',
    default: {},
  })
  metadata?: any;

  @Column({
    default: 'safe2pay',
  })
  gateway?: string;

  @Column({
    type: 'jsonb',
    default: {},
  })
  additional_info?: any;

  @Column({ type: 'float', default: 0 })
  transaction_amount: number;

  @Column({
    type: 'float',
    default: 0,
  })
  transaction_amount_refunded?: number;

  @Column({
    type: 'jsonb',
    default: {},
  })
  transaction_details?: {
    net_received_amount: number;
    total_paid_amount: number;
    overpaid_amount: number;
    external_transaction_id: string;
  };

  @Column({
    type: 'jsonb',
    default: {},
  })
  payment_method_details?: any;

  @Column({
    type: 'jsonb',
    default: [],
  })
  card?: {
    last_four_digits?: string;
    first_six_digits?: string;
    expiration_month?: number;
    expiration_year?: number;
    holder_name?: string;
    date_created: string;
    date_last_updated: string;

    card_token?: string;

    external_transaction_id: string;
    individual_installments: number;
    individual_amount: number;
    total_paid_amount: number;
  }[];

  @Column({
    type: 'jsonb',
    default: '[]',
  })
  split_accounts?: {
    account_id: string;
    account_type: string;
    account_transaction_id?: string;
    amount: number;
    amount_paid: number;
    amount_tax: number;
    amount_refunded?: number;
    paid: boolean;
    days_to_receive: number;
    penality?: number;
    secure_reserve_value?: number;
    secure_reserve_tax?: number;
  }[];

  @Column({
    default: false,
  })
  forced_status?: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_created?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_last_updated?: Date;

  @Column({ nullable: true })
  date_approved?: Date;

  @Column()
  buyer_id: string;

  @OneToOne(() => TransactionsBuyers)
  @JoinColumn({ name: 'buyer_id' })
  buyer?: TransactionsBuyers;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'seller_id' })
  seller?: Users;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  product?: Products;
}
