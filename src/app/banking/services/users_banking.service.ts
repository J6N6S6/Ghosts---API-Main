import { Injectable } from '@nestjs/common';
import { CreateBankAccountDTO } from '../dtos/CreateBankAccountDTO';
import { AccountBalanceReturn } from '../dtos/GetAccountBalanceDTO';
import { UpdateBankAccountDTO } from '../dtos/UpdateBankAccountDTO';
import { CreateBankAccountCase } from '../useCases/create-bank-account/create_bank_account.case';
import { DeleteBankAccountCase } from '../useCases/delete-bank-account/delete_bank_account.case';
import { GetAccountBalanceCase } from '../useCases/get-account-balance/get_account_balance.case';
import { GetBankAccountCase } from '../useCases/get-bank-account/get_bank_account.case';
import { ListPendingBalanceCase } from '../useCases/list-pending-balance/list_pending_balance';
import { UpdateBankAccountCase } from '../useCases/update-bank-account/update_bank_account.case';

@Injectable()
export class UsersBankingService {
  constructor(
    private readonly createBankAccountCase: CreateBankAccountCase,
    private readonly updateBankAccountCase: UpdateBankAccountCase,
    private readonly getBankAccountCase: GetBankAccountCase,
    private readonly getAccountBalanceCase: GetAccountBalanceCase,
    private readonly listPendingBalanceCase: ListPendingBalanceCase,
    private readonly deleteBankAccountCase: DeleteBankAccountCase,
  ) {}

  async getUserBankingAccout(user_id: string): Promise<any> {
    return await this.getBankAccountCase.execute(user_id);
  }

  async createUserBankingAccout(data: CreateBankAccountDTO): Promise<any> {
    return await this.createBankAccountCase.execute(data);
  }

  async updateUserBankingAccout(data: UpdateBankAccountDTO): Promise<any> {
    return await this.updateBankAccountCase.execute(data);
  }

  async deleteUserBankingAccout(
    user_id: string,
    account_id: string,
  ): Promise<any> {
    return await this.deleteBankAccountCase.execute(user_id, account_id);
  }

  async getAccountBalance(user_id: string): Promise<AccountBalanceReturn> {
    return await this.getAccountBalanceCase.execute(user_id);
  }

  async getPendingBalance(user_id: string) {
    return await this.listPendingBalanceCase.execute(user_id);
  }
}
