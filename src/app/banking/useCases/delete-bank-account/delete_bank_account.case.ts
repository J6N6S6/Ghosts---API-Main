import { UserBankingAccountsRepository } from '@/domain/repositories/user_banking_accounts.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteBankAccountCase {
  constructor(
    private readonly userBankingAccountsRepository: UserBankingAccountsRepository,
  ) {}

  async execute(user_id: string, account_id: string): Promise<any> {
    try {
      const user_account = await this.userBankingAccountsRepository.findById(
        account_id,
      );

      if (!user_account || user_account.user_id !== user_id)
        throw new ClientException('Essa conta bancária não existe');

      return await this.userBankingAccountsRepository.deleteById(account_id);
    } catch (err) {
      if (err instanceof ClientException) throw err;
      throw new ServerException(err.message, {
        user_id,
        account_id,
      });
    }
  }
}
