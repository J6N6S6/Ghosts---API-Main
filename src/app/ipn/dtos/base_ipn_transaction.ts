import { GetStatusPayment } from '@/app/gateways/dtos/GetStatusPayment.dto';
import { Transaction } from '@/domain/models/transaction.model';

export interface BaseIpnTransaction {
  payment_data?: GetStatusPayment;
  transaction: Transaction;
  status?: string;
  skipNotification?: boolean;
}
