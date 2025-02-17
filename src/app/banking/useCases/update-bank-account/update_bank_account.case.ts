import { UserBankingAccount } from '@/domain/models/user_banking_account.model';
import { UserBankingAccountsRepository } from '@/domain/repositories/user_banking_accounts.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';
import { UpdateBankAccountDTO } from '../../dtos/UpdateBankAccountDTO';

@Injectable()
export class UpdateBankAccountCase {
  constructor(
    private readonly userBankingAccountsRepository: UserBankingAccountsRepository,
  ) {}

  async execute({
    account_id,
    bank_name,
    is_corporate,
    pix_key,
    pix_type,
    user_id,
    name,
    bank_account,
    bank_account_type,
    bank_agency,
  }: UpdateBankAccountDTO): Promise<any> {
    try {
      const user_account = await this.userBankingAccountsRepository.findById(
        account_id,
      );

      if (!user_account || user_account.user_id !== user_id)
        throw new ClientException('Essa conta bancária não existe');

      const account_bank = new UserBankingAccount(user_account);

      if (bank_name) account_bank.bank_name = bank_name;
      if (typeof is_corporate === 'boolean')
        account_bank.is_corporate = is_corporate;
      if (pix_key) account_bank.pix_key = pix_key;
      if (pix_type) account_bank.pix_type = pix_type;
      if (name) account_bank.name = name;
      if (bank_account) account_bank.bank_account = bank_account;
      if (bank_account_type) account_bank.bank_account_type = bank_account_type;
      if (bank_agency) account_bank.bank_agency = bank_agency;

      return await this.userBankingAccountsRepository.update(account_bank);
    } catch (err) {
      if (err instanceof ClientException) throw err;
      throw new ServerException(err.message, {
        account_id,
        bank_name,
        is_corporate,
        pix_key,
        pix_type,
        user_id,
        name,
      });
    }
  }
}
