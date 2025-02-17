import { ICalculatePaymentResponse } from '@/app/gateways/dtos/calculate_payment';
import { Products, TransactionsBuyers } from '@/infra/database/entities';

export interface IExecutePaymentDTO {
  transaction_data: ICalculatePaymentResponse;
  product_link: string;
  product: Products;
  payment_method: 'CREDIT_CARD' | 'PIX' | 'BANK_SLIP';
  additional_products?: {
    product_id: string;
    unit_price: number;
  }[];
  buyer: TransactionsBuyers;
  card_data:
    | {
        card_number?: string;
        card_holder_name?: string;
        card_expiration_date?: string;
        card_cvv?: string;
        card_token?: string;
        installment: number;
        amount: number;
      }[]
    | null;
  product_price: number;
  total_value: number;
  requester: any;
}
