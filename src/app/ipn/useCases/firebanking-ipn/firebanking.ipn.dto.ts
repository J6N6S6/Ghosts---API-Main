export interface FirebankingDTO {
  transactionId: string;
  businessTransactionId: string;
  status: 'PAID' | 'REFUND';
  value: number;
  createdDate: Date;
}
