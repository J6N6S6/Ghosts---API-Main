export type CreatePaymentOrder = PaymentsType & {
  IpAddress?: string;
  Application: string;
  Vendor: string;
  Reference: string;
  PaymentMethod: 'CREDIT_CARD' | 'BANK_SLIP' | 'PIX';
  Customer: {
    Name: string;
    Email: string;
    Identity: string;
    Phone: string;
    Address: {
      ZipCode: string;
      Street: string;
      Number: string;
      Complement: string;
      District: string;
      CityNam: string;
      StateInitials: string;
      CountryName: string;
    } | null;
  };
  Products: {
    Code: string;
    Description: string;
    Quantity: number;
    UnitPrice: number;
  }[];
};

interface CreditCardType {
  Holder: string;
  CardNumber: string;
  ExpirationDate: string;
  SecurityCode: string;
  IsApplyInterest?: boolean;
  InstallmentQuantity: number;
}

interface BankSlipType {
  DueDate: Date;
}

interface PixType {
  Expiration: number;
}

type PaymentsType =
  | {
      PaymentMethod: 'CREDIT_CARD';
      PaymentObject: CreditCardType;
    }
  | {
      PaymentMethod: 'BANK_SLIP';
      PaymentObject: BankSlipType;
    }
  | {
      PaymentMethod: 'PIX';
      PaymentObject: PixType;
    }
  | {
      PaymentMethod: any;
      PaymentObject: any;
    };
