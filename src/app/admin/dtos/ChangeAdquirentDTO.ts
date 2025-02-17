export interface ChangeAdquirentDTO {
  payment_method: 'PIX' | 'CREDIT_CARD' | 'BANK_SLIP';
  adquirent: string;
}
