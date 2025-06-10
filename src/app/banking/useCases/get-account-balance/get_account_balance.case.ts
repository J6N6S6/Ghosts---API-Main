import { UserBankingTransactionsRepository } from '@/domain/repositories/user_banking_transactions.repository';
import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as dayjs from 'dayjs';

@Injectable()
export class GetAccountBalanceCase {
  constructor(
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
    private readonly userSecureReserveRespository: IEUserSecureReserveRepository,
    private readonly withdrawalsRepository: WithdrawalsRepository,
    private readonly usersRepository: UsersRepository,

    @InjectQueue('settle_user_reserved_balance')
    private readonly settleUserReservedBalanceQueue: Queue,

    @InjectQueue('process_balance_regularization')
    private readonly balanceRegularizationQueue: Queue, // <-- Corrigido
  ) {}

  async execute(user_id: string, shouldSettleReservedBalance = true) {
    if (shouldSettleReservedBalance) {
      await this.settleUserReservedBalanceQueue.add('settle', { user_id });
    }

    const [balance, withdrawals, reservedTransactions] = await Promise.all([
      this.userBankingTransactionsRepository.getBalanceByUserId(user_id),
      this.withdrawalsRepository.find({
        where: {
          user_id,
          status: In(['pending', 'approved']),
        },
      }),
      this.userSecureReserveRespository.findMany({
        where: {
          user_id,
          status: 'in_reserve',
        },
      }),
    ]);

    const total_balance = Number(balance.toFixed(2));

    if (shouldSettleReservedBalance && total_balance < 0) {
      await this.balanceRegularizationQueue.add('regularize', {
        user_id,
        user_available_balance: total_balance,
      });
    }

    const [pending_withdrawals, approved_withdrawals] = withdrawals.reduce(
      (acc, withdrawal) => {
        if (withdrawal.status === 'pending') {
          acc[0] += withdrawal.amount;
        } else {
          acc[1] += withdrawal.amount;
        }
        return acc;
      },
      [0, 0],
    );

    let reserve_amount = 0;
    let pending_balance = 0;

    const now = dayjs();

    for (const tx of reservedTransactions) {
      const createdAt = dayjs(tx.created_at);
      const days = now.diff(createdAt, 'day');

      let percentage = 0;
      if (days < 7) percentage = 0.1;
      else if (days < 15) percentage = 0.07;
      else if (days < 30) percentage = 0.03;

      const reserve = tx.value * percentage;
      reserve_amount += reserve;
      pending_balance += reserve; // conforme comentário no código original
    }

    return {
      total_balance: Number((total_balance + reserve_amount).toFixed(2)),
      available_balance: Number(total_balance.toFixed(2)),
      reserve_amount: Number(reserve_amount.toFixed(2)),
      pending_balance: Number(pending_balance.toFixed(2)),
      pending_withdrawals: Number(pending_withdrawals.toFixed(2)),
      approved_withdrawals: Number(approved_withdrawals.toFixed(2)),
    };
  }
}
