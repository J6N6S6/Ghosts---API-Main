interface PayerUtmDTO {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

interface PayerAddressDTO {
  cep: string;
  city: string;
  street: string;
  neighborhood: string;
  state: string;
  number?: string;
  complement?: string;
}

interface PayerDTO {
  name: string;
  email: string;
  document: string;
  phone?: string;
  birth_date?: string;
  address?: PayerAddressDTO;
  utm?: PayerUtmDTO;
}

export interface ICreatePaymentDTO {
  product_value: number;
  product_link?: string;
  additional_products?: {
    product_id: string;
    product_value: number;
  }[];
  payer: PayerDTO;
  payment_method: 'PIX' | 'CREDIT_CARD' | 'BANK_SLIP';
  use_two_cards?: boolean;
  card_data?: {
    card_number?: string;
    card_holder_name?: string;
    card_expiration_date?: string;
    card_cvv?: string;
    card_token?: string;
    installment: number;
    amount: number;
  }[];
  affiliate_id?: string;
  requester?: {
    client_ip: any;
    user_agent: any;
  };
}
