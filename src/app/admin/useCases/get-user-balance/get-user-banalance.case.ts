import { UserBankingTransactionsRepository } from '@/domain/repositories/user_banking_transactions.repository';
import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { In, MoreThan } from 'typeorm';

@Injectable()
export class GetUserBalanceCase {
  constructor(
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
    private readonly userSecureReserveRespository: IEUserSecureReserveRepository,
    private readonly withdrawalsRepository: WithdrawalsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(user_id: string, shouldSettleReservedBalance = true) {
    const [user, balance, projection_balance, withdrawals] = await Promise.all([
      this.usersRepository.findBy({
        where: {
          id: user_id,
        },
        select: ['id', 'name', 'email', 'tax'],
        relations: ['tax'],
      }),
      this.userBankingTransactionsRepository.getBalanceByUserId(user_id),
      this.userBankingTransactionsRepository.findMany({
        where: {
          user_id,
          liquidation_date: MoreThan(dayjs().subtract(30, 'days').toDate()),
        },
        select: ['value', 'liquidation_date', 'created_at', 'operation_type'],
        relations: ['transaction'],
      }),
      this.withdrawalsRepository.find({
        where: {
          user_id,
          status: In(['pending', 'approved']),
        },
      }),
    ]);

    const total_balance = Number(balance.toFixed(2));

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

    // available_balance precisa ser calculado o valor das movimentacoes pendentes
    // considerando que o liquidation_date seja maior que hoje, e se a data for menor que 30d, acrescetar no pending_balance e reserve_amount
    // o valor da reserva, o valor da reserva e de acordo com a % de reserva do usuario que e definida pela taxa, a taxa e baseada no dias que
    // que a transacao foi feita, se foi feita em 7d e 10%, 15d e 7%, 30d e 3%

    const reserved_amount =
      await this.userSecureReserveRespository.getReservedAmountByUserId(
        user_id,
      );

    const reserve_amount = reserved_amount || 0;
    const pending_balance = reserved_amount || 0;

    return {
      total_balance: total_balance + reserve_amount,
      available_balance: Number(total_balance.toFixed(2)),
      reserve_amount: Number(reserve_amount.toFixed(2)),
      pending_balance: Number(pending_balance.toFixed(2)),
      pending_withdrawals: Number(pending_withdrawals.toFixed(2)),
      approved_withdrawals: Number(approved_withdrawals.toFixed(2)),
    };
  }
}
