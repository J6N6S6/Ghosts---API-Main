export interface BasePayment {
  total_amount: number;
  items: Item[];
  payer: Payer;
  transaction_id: string;
  seller_name: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
  category_id?: string;
}

interface Payer {
  type?: string;
  id?: string;
  email: string;
  identification: Identification;
  phone?: Phone;
  first_name: string;
  last_name: string;
  address?: Address;
  ip_address?: string;
}

type Identification = {
  type: string;
  number: string;
};

type Phone = {
  area_code?: string;
  number?: string;
};

type Address = {
  zip_code?: string;
  street_name?: string;
  street_number?: number;
  neighborhood?: string;
  city?: string;
  federal_unit?: string;
  country?: string;
};
