import { BasePayment } from './BasePayment.dto';

export interface CreatePixPaymentDTO extends BasePayment {
  date_expiration: string;
}
