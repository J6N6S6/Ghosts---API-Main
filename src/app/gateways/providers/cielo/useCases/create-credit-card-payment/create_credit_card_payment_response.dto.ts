export interface CreateCreditCardPaymentResponseDTO {
  MerchantOrderId: string;
  Customer: Customer;
  Payment: Payment;
}

export interface Customer {
  Name: string;
  Identity: string;
  IdentityType: string;
  Email: string;
  Birthdate: string;
  Address: Address;
  DeliveryAddress: DeliveryAddress;
  Billing: Billing;
}

export interface Address {
  Street: string;
  Number: string;
  Complement: string;
  ZipCode: string;
  City: string;
  State: string;
  Country: string;
}

export interface DeliveryAddress {
  Street: string;
  Number: string;
  Complement: string;
  ZipCode: string;
  City: string;
  State: string;
  Country: string;
}

export interface Billing {
  Street: string;
  Number: string;
  Complement: string;
  Neighborhood: string;
  City: string;
  State: string;
  Country: string;
  ZipCode: string;
}

export interface Payment {
  ServiceTaxAmount: number;
  Installments: number;
  Interest: string;
  Capture: boolean;
  Authenticate: boolean;
  CreditCard: CreditCard;
  IsCryptoCurrencyNegotiation: boolean;
  TryAutomaticCancellation: boolean;
  ProofOfSale: string;
  Tid: string;
  AuthorizationCode: string;
  SoftDescriptor: string;
  PaymentId: string;
  Type: string;
  Amount: number;
  CapturedAmount: number;
  Country: string;
  AirlineData: AirlineData;
  ExtraDataCollection: any[];
  Status: number;
  ReturnCode: string;
  ReturnMessage: string;
  MerchantAdviceCode: string;
  Links: Link[];
}

export interface CreditCard {
  CardNumber: string;
  Holder: string;
  ExpirationDate: string;
  SaveCard: boolean;
  Brand: string;
  PaymentAccountReference: string;
  CardOnFile: CardOnFile;
}

export interface CardOnFile {
  Usage: string;
  Reason: string;
}

export interface AirlineData {
  TicketNumber: string;
}

export interface Link {
  Method: string;
  Rel: string;
  Href: string;
}
