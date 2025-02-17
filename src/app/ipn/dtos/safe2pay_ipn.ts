export interface ISafe2PayIpn {
  IdTransaction: number;
  TransactionStatus: {
    Id: number;
    Code: string;
    Name: string;
  };
  PaymentMethod: {
    Id: number;
    Code: string;
    Name: string;
  };
  Application: string;
  Vendor: string;
  Reference: string;
  Amount: number;
  IncluedDate: Date;
  PaymentDate: Date;
  InstallmentQuantity: number;
  SecretKey: string;

  DiscountAmount?: number;
  PaidValue?: number;
  AdditionValue?: number;
  NetValue?: number;
  TaxValue?: number;

  CheckingAccounts?: any;
  Splits?: {
    IdTransactionSplitter: number;
    IdReceiver: number;
    CodeTaxType: number;
    Identity: string;
    Name: string;
    IsPayTax: boolean;
    Amount: number;
  }[];
}
