export interface CreatePixPaymentResponseDTO {
  hash: string;
  payer_name: string;
  amount: number;
  description: string;
  external_id: string;
  paid_at: any;
  created_at: string;
  expiration_at: any;
  payment: string;
  status: number;
  endToEndId: any;
  reference: string;
}
