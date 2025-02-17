export interface CreatePixPaymentResponseDTO {
  transactionId: string;
  status: 'WAITING_PAYMENT' | 'PAID';
  pixQrCode: string;
  pixCode: string;
  generateTime: Date;
}
