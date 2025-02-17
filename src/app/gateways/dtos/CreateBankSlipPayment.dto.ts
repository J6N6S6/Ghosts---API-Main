import { BasePayment } from './BasePayment.dto';

export interface CreateBankSlipPaymentDTO extends BasePayment {
  date_expiration: string;
}
