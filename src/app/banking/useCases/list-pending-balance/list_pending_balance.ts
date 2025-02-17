import { ClientException } from '@/infra/exception/client.exception';
import { UserBankingTransactionsRepository } from '@/domain/repositories/user_banking_transactions.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListPendingBalanceCase {
  constructor(
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
  ) {}

  async execute(user_id: string): Promise<any> {
    try {
      const transactions =
        await this.userBankingTransactionsRepository.getPendingBalanceByUserId(
          user_id,
        );

      return transactions;
    } catch (err) {
      throw new ClientException(err.message);
    }
  }
}
