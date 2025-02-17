export interface PaggueioDTO {
  hash: string;
  status: string;
  paid_at: string;
  amount: number;
  external_id: string;
  bank_account: BankAccount;
  ipn_secret: string;
}

interface BankAccount {
  holder: string;
  document: string;
  account: string;
  account_type: string;
  account_digit: string;
  agency: string;
  ispb: string;
}
