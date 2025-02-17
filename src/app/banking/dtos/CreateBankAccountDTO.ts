export interface CreateBankAccountDTO {
  user_id: string;
  is_corporate: boolean;
  pix_key: string;
  pix_type: string;
  name?: string;
  bank_name: string;
  bank_agency: string;
  bank_account: string;
  bank_account_type: 'CC' | 'CP';
}
