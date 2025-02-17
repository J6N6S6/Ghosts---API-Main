export interface ITransactionsSplits {
  id?: string;
  transaction_id: string;
  user_id: string;
  split_value: number;
  split_refunded: boolean;
  created_at?: Date;
  updated_at?: Date;
}
