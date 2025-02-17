export type PaymentOrderResponse = {
  HasError: boolean;
  Error?: string;
  ErrorCode?: string;
  ResponseDetail: ResponseDetail;
};

type ResponseDetail = {
  transaction_id: string;
  IdTransaction: string;
  Status: string;
  Message: string;
  Description: string;
  AuthorizationCode: string;

  Token: string;
  CreditCard: {
    CardNumber: string;
    Brand: number;
    Installments: number;
  };

  BankSlipNumber: string;
  DueDate: Date;
  Barcode: string;
  BankSlipUrl: string;
  QrCodePix: string;
  KeyPix: string;
  DigitableLine: string;

  QrCode: string;
  Key: string;
};
