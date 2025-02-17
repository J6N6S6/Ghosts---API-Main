export interface CreateCreditCardPaymentResponseDTO {
  type: boolean;
  Charge: Charge;
}

export interface Charge {
  galaxPayId: number;
  myId: string;
  planMyId: string;
  planGalaxPayId: number;
  mainPaymentMethodId: string;
  paymentLink: string;
  value: number;
  additionalInfo: string;
  status: string;
  payedOutsideGalaxPay: boolean;
  Customer: Customer;
  Transactions: Transaction[];
  PaymentMethodCreditCard: PaymentMethodCreditCard;
}

export interface Customer {
  galaxPayId: number;
  myId: string;
  name: string;
  document: string;
  emails: string[];
  phones: number[];
  createdAt: string;
  updatedAt: string;
  Address: Address;
}

export interface Address {
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Transaction {
  galaxPayId: number;
  value: number;
  payday: string;
  installment: number;
  statusDate: string;
  status: string;
  datetimeLastSentToOperator: string;
  statusDescription: string;
  reasonDenied: string;
  authorizationCode: string;
  tid: string;
  AbecsReasonDenied: AbecsReasonDenied;
  CreditCard: CreditCard;
  Transaction3DS: Transaction3Ds;
}

export interface AbecsReasonDenied {
  code: string;
  message: string;
}

export interface CreditCard {
  Card: Card;
}

export interface Card {
  myId: string;
  galaxPayId: number;
  number: string;
  createdAt: string;
  updatedAt: string;
  Brand: Brand;
  expiresAt: string;
}

export interface Brand {
  id: string;
  name: string;
  maxInstallment: number;
  operatorIds: string;
}

export interface Transaction3Ds {
  message: string;
  urlAuthentication: string;
}

export interface PaymentMethodCreditCard {
  qtdInstallments: number;
  Card: Card2;
  Link: Link;
}

export interface Card2 {
  myId: string;
  galaxPayId: number;
  number: string;
  createdAt: string;
  updatedAt: string;
  Brand: Brand2;
  expiresAt: string;
  isBackup: boolean;
}

export interface Brand2 {
  id: string;
  name: string;
  maxInstallment: number;
  operatorIds: string;
}

export interface Link {
  minInstallment: number;
  maxInstallment: number;
}
