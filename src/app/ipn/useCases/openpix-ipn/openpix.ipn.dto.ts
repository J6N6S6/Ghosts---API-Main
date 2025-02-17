export interface OpenPixIpnDTO {
  event: string;
  charge: Charge;
  pix: Pix;
  company: Company;
  account: Record<string, never>;
  ipn_secret: string;
}

interface TaxID {
  taxID: string;
  type: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  taxID: TaxID;
  correlationID: string;
}

interface AdditionalInfo {
  key: string;
  value: string;
}

interface Payer {
  name: string;
  taxID: TaxID;
  correlationID: string;
}

interface Charge {
  customer: Customer;
  value: number;
  comment: string;
  identifier: string;
  correlationID: string;
  paymentLinkID: string;
  transactionID: string;
  status: string;
  additionalInfo: AdditionalInfo[];
  discount: number;
  valueWithDiscount: number;
  expiresDate: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string;
  payer: Payer;
  brCode: string;
  expiresIn: number;
  pixKey: string;
  paymentLinkUrl: string;
  qrCodeImage: string;
  globalID: string;
  fee?: number; // Optional field for Charge
}

interface Pix {
  customer: Customer;
  payer: Payer;
  charge: Charge;
  value: number;
  time: string;
  endToEndId: string;
  transactionID: string;
  infoPagador: string;
  type: string;
  createdAt: string;
  globalID: string;
}

interface Company {
  id: string;
  name: string;
  taxID: string;
}
