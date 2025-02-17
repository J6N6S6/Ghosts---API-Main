import { CreateBankAccountDTO } from './CreateBankAccountDTO';

export interface UpdateBankAccountDTO extends CreateBankAccountDTO {
  account_id: string;
}
