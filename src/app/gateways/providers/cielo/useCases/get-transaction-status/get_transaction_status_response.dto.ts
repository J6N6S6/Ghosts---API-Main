export interface GetTransactionStatusResponseDTO {
  MerchantOrderId: string;
  AcquirerOrderId: string;
  Customer: Customer;
  Payment: Payment;
}

export interface Customer {
  Name: string;
}

export interface Payment {
  ServiceTaxAmount: number;
  Installments: number;
  Interest: string;
  Capture: boolean;
  Authenticate: boolean;
  CreditCard: CreditCard;
  ProofOfSale: string;
  Tid: string;
  AuthorizationCode: string;
  Chargebacks: Chargeback[];
  FraudAlert: FraudAlert;
  PaymentId: string;
  Type: string;
  Amount: number;
  ReceivedDate: string;
  CapturedAmount: number;
  CapturedDate: string;
  VoidedAmount: number;
  VoidedDate: string;
  Currency: string;
  Country: string;
  ExtraDataCollection: any[];
  Status: number;
  Links: Link[];
}

export interface CreditCard {
  CardNumber: string;
  Holder: string;
  ExpirationDate: string;
  SaveCard: boolean;
  Brand: string;
  PaymentAccountReference: string;
}

export interface Chargeback {
  Amount: number;
  CaseNumber: string;
  Date: string;
  ReasonCode: string;
  ReasonMessage: string;
  Status: string;
  RawData: string;
}

export interface FraudAlert {
  Date: string;
  ReasonMessage: string;
  IncomingChargeback: boolean;
}

export interface Link {
  Method: string;
  Rel: string;
  Href: string;
}
