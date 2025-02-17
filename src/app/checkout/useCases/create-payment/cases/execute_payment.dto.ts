import { Transactions } from '@/infra/database/entities';

export interface ExecutePaymentDTO {
  transaction: Transactions;
  seller_name: string;
  total_value: number;
  installments?: number;
  items: {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    description: string;
    category_id: string;
  }[];
  payer: {
    first_name: string;
    last_name: string;
    email: string;
    identity: string;
    phone?: string;
    address?: {
      cep: string;
      city: string;
      street: string;
      number?: string;
      complement?: string;
      neighborhood: string;
      state: string;
    };
  };
  card_data?: {
    card_number?: string;
    card_holder_name?: string;
    card_expiration_date?: string;
    card_cvv?: string;
    card_token?: string;
    amount: number;
  };
  product_gateway?: string;
}
