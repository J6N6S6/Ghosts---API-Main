// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateNewRefundRequestDto {
  buyer_name: string;
  transaction_email: string;
  buyer_document: string;
  buyer_phone: string;
  transaction_id: string;
  pix_key: string;

  reason: string;
  status?: 'AUTHORIZED' | 'PENDING' | 'REJECTED';
}
