import { ITransactions } from './transactions.type';

export interface ITransactionsBuyers {
  id?: string;
  visitor_id: string;
  product_id: string;
  affiliate_id?: number;
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
  payer_name?: string;
  payer_document?: string;
  payment_method: string;
  transaction_id?: string;
  created_at?: Date;
  updated_at?: Date;

  Transaction?: ITransactions;
}
