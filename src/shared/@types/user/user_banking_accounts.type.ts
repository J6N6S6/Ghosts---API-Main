import { BankTypeEnum } from '@/infra/dtos/user/user_bank';

export interface IUserBankingAccounts {
  id?: string;
  user_id: string;
  is_corporate: boolean;
  responsible_name?: string;
  responsible_cpf?: string;
  responsible_phone?: string;
  corporate_name?: string;
  contact_mail?: string;

  bank_code: string;
  bank_name: string;
  bank_agency: string;
  bank_account: string;
  bank_digit: string;
  bank_type: BankTypeEnum;

  address_street: string;
  address_number?: string;
  address_complement?: string;
  address_city: string;
  address_state: string;
  address_state_initials?: string;

  account_token?: string;
  account_id?: string;
  account_identity?: string;
  account_name?: string;

  additional_data?: object | any;

  created_at?: Date;
  updated_at?: Date;
}
