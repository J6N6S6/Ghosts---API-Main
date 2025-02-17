import { TransactionsRepository } from '@/domain/repositories';
import { UserBankingTransactionsRepository } from '@/domain/repositories/user_banking_transactions.repository';
import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { Injectable } from '@nestjs/common';
import { In, MoreThan } from 'typeorm';

@Injectable()
export class GetUserMetricsCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,

    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(user_id: string) {
    const [authorized_transactions_count, chargeback_transactions_count] =
      await Promise.all([
        this.transactionsRepository.count({
          where: {
            seller_id: user_id,
            status: 'AUTHORIZED',
          },
        }),
        this.transactionsRepository.count({
          where: {
            seller_id: user_id,
            status: In(['CHARGEBACK', 'REFUNDED']),
          },
        }),
      ]);

    const chargeback_percentage = authorized_transactions_count
      ? (chargeback_transactions_count / authorized_transactions_count) * 100
      : 0;

    return {
      authorized_transactions_count,
      chargeback_transactions_count,
      chargeback_percentage,
    };
  }
}
