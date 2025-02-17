export interface GetStatusPayment {
  status: string;
  status_detail: string;
  payment_id: string;
  external_reference: string;
  transaction_amount: number;
  total_paid_amount: number;
  net_received_amount?: number;

  date_approved?: string;
}
