import { Transaction } from '@/domain/models/transaction.model';

export interface CreateOrderDTO {
  user_id: string;
  transaction: Transaction;
}
