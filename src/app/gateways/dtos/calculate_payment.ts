export interface ICalculatePaymentDTO {
  total_value: number;
  use_two_cards?: boolean;
  cards: {
    card_installment: number;
    amount: number;
  }[];
  splits: {
    type: string;
    user_id: string;
    commission: number;
    commissionOrderBump: number;
    days_to_receive: number;
    tax: {
      fixed_amount: number;
      percentage: number;
    };
  }[];
  additional_products?: {
    product_id: string;
    product_value: number;
  }[];
  tax_producer: {
    fixed_amount: number;
    percentage: number;
    reserve_time: '90d' | '30d' | '60d' | string;
    reserve_percentage: number;
  };
  secure_reserve_fee: {
    percentage: number;
  };
}

export interface ICalculatePaymentResponse {
  total_transaction_value: number;
  producer_receives: number;
  producer_tax: number;
  participants: {
    type: string;
    user_id: string;
    commission: number;
    commissionOrderBump: number;

    receives: number;
    days_to_receive: number;
    tax: number;
  }[];
  transactions: {
    installment: number;
    amount: number;
    tax: number;
  }[];
  totalSecureReserve: number;
  secure_reserve_tax: number;
}
