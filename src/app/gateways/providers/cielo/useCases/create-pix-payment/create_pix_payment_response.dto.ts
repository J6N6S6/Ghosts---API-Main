export interface CreatePixPaymentResponseDTO {
  MerchantOrderId: string;
  Customer: Customer;
  Payment: Payment;
}

export interface Customer {
  Name: string;
  Identity: string;
  IdentityType: string;
}

export interface Payment {
  QrCodeBase64Image: string;
  QrCodeString: string;
  Tid: string;
  ProofOfSale: string;
  SentOrderId: string;
  Amount: number;
  ReceivedDate: string;
  Provider: string;
  Status: number;
  IsSplitted: boolean;
  ReturnMessage: string;
  ReturnCode: string;
  PaymentId: string;
  Type: string;
  Currency: string;
  Country: string;
  Links: Link[];
}

export interface Link {
  Method: string;
  Rel: string;
  Href: string;
}
