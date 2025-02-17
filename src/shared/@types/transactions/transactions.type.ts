export interface ITransactions {
  id?: string;
  buyer_id: string;
  seller_id: string;
  status?: string;
  transaction_id?: string;
  payment_method: string;
  payment_data?: string | any;
  total_amount: number;
  net_amount?: number;
  paid_amount?: number;
  refunded_amount?: number;
  voucher_discount?: number;
  voucher_id?: string;
  voucher_code?: string;
  affiliate_id?: string;
  affiliate_commission?: number;
  installment?: number;

  product_id: string;

  product_details?: string | any;

  order_bump?: string | any;

  is_delivered: boolean;

  paidAt?: Date;
  created_at?: Date;
  updated_at?: Date;
}
