import { BasePayment } from './BasePayment.dto';

export interface CreateCreditCardPaymentDTO extends BasePayment {
  card_token: boolean;
  installments: number;
  token?: string;
  card?: {
    holder_name: string;
    number: string;
    expiration_date: string;
    cvv: string;
  };
}
