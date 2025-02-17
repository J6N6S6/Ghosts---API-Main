export interface RefundRequestDTO {
  id?: string;
  buyer_name: string;
  transaction_email: string;
  buyer_document: string;
  buyer_phone: string;
  transaction_id: string;
  pix_key: string;
  reason: string;
  status: RefundRequestStatus;
  buyer_bank_account?: any;
}

export type RefundRequestStatus =
  | 'CONCLUDED'
  | 'WAITING_REFUND_PAYMENT'
  | 'PENDING'
  | 'REJECTED';
