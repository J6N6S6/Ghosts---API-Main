import { UserBankingTransactionsRepository } from '@/domain/repositories/user_banking_transactions.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { WithdrawalsRepository } from '@/domain/repositories/withdrawals.repository';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { In, MoreThan } from 'typeorm';
@Injectable()
export class WithdrawalsSecretCase {
  constructor(
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
    private readonly withdrawalsRepository: WithdrawalsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(): Promise<any> {
    const [users, balances, projection_balances, withdrawalss] =
      await Promise.all([
        this.usersRepository.find({
          where: {
            blocked_access: false,
          },
          select: ['id', 'name', 'email', 'tax'],
          relations: ['tax'],
        }),
        this.userBankingTransactionsRepository.getBalancesForAllUsers(),
        this.userBankingTransactionsRepository.findMany({
          where: {
            liquidation_date: MoreThan(dayjs().subtract(30, 'days').toDate()),
          },
          select: ['value', 'liquidation_date', 'created_at', 'operation_type'],
          relations: ['transaction'],
        }),
        this.withdrawalsRepository.find({
          where: {
            status: In(['pending', 'approved']),
          },
        }),
      ]);

    let total_balance = 0;
    let pending_balance = 0;
    let reserve_amount = 0;
    let pending_withdrawals = 0;
    let approved_withdrawals = 0;

    for (const user of users) {
      const user_id = user.id;
      const balance = balances.find((user) => user.user_id === user_id);
      const projection_balance = projection_balances.filter(
        (transaction) => transaction.user_id === user_id,
      );
      const withdrawals = withdrawalss.filter(
        (withdrawal) => withdrawal.user_id === user_id,
      );

      if (balance) total_balance += Number(balance.balance.toFixed(2));

      const [pw, aw] = withdrawals.reduce(
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

      pending_withdrawals += pw;
      approved_withdrawals += aw;

      const [ra, pb] = projection_balance.reduce(
        (acc, transaction) => {
          if (
            transaction?.transaction &&
            transaction?.transaction?.status !== 'AUTHORIZED' &&
            transaction?.transaction?.status !== 'PAID' &&
            transaction?.transaction?.status !== 'APPROVED'
          )
            return acc;
          if (transaction.operation_type === 'expense') transaction.value *= -1;
          //  se ja passou 30 dias desde a transacao, nao precisa calcular a reserva e nem adicionar como pendente

          if (dayjs(transaction.liquidation_date).isAfter(dayjs())) {
            acc[1] += transaction.value;
            return acc;
          } else {
            // se a transacao for feita no pix ou boletos, nao precisa calcular a reserva, calcular somente se for cartao
            if (
              !transaction?.transaction ||
              transaction?.transaction?.payment_method !== 'CREDIT_CARD'
            )
              return acc;

            if (
              dayjs(transaction.created_at).isBefore(
                dayjs().subtract(30, 'days'),
                'seconds',
              )
            )
              return acc;

            const days =
              transaction.transaction.split_accounts.find(
                (i) => i.account_id === user_id,
              ).days_to_receive || 30;

            let tax = user.tax.security_reserve_fee[days + 'd'];

            if (!tax) tax = user.tax.security_reserve_fee['30d'];

            const reserve_value = (transaction.value * tax.percentage) / 100;
            acc[0] += reserve_value;
            acc[1] += reserve_value;
          }

          return acc;
        },
        [0, 0],
      );

      reserve_amount += ra;
      pending_balance += pb;
    }

    return {
      total_balance: total_balance,
      available_balance: Number((total_balance - pending_balance).toFixed(2)),
      reserve_amount: Number(reserve_amount.toFixed(2)),
      pending_balance: Number(pending_balance.toFixed(2)),
      pending_withdrawals: Number(pending_withdrawals.toFixed(2)),
      approved_withdrawals: Number(approved_withdrawals.toFixed(2)),
    };
  }
}
