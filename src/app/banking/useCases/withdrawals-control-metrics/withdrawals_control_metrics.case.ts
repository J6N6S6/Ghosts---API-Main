import { TransactionsRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Between, Raw } from 'typeorm';
import { GetAccountBalanceCase } from '../get-account-balance/get_account_balance.case';
import { WithdrawalsControlMetricsDTO } from './withdrawals_control_metrics.dto';

@Injectable()
export class WithdrawalsControlMetricsCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly getAccountBalanceCase: GetAccountBalanceCase,
  ) {}

  async execute({ user_id }: WithdrawalsControlMetricsDTO): Promise<any> {
    const balance = await this.getAccountBalanceCase.execute(user_id);

    const transactions = await this.transactionsRepository.findAll({
      where: {
        split_accounts: Raw(
          () => `EXISTS (
          SELECT 1
          FROM jsonb_array_elements(split_accounts) AS x
          WHERE x->>'account_id' = '${user_id}' OR x->>'seller_id' = '${user_id}'
        )`,
        ),
        date_created: Between(
          dayjs().subtract(30, 'day').toDate(),
          dayjs().endOf('day').toDate(),
        ),
      },
      select: {
        status: true,
        split_accounts: true,
      },
    });

    const approved_transactions = transactions.filter(
      (transaction) => transaction.status === 'AUTHORIZED',
    );

    const refunded_transactions = transactions.filter(
      (transaction) => transaction.status === 'REFUNDED',
    );

    const userLast30DaysSales = approved_transactions.reduce((acc, cur) => {
      const account = cur.split_accounts.find(
        (account) => account.account_id === user_id,
      );

      if (!account) return acc;

      return acc + account.amount_paid;
    }, 0);

    const userLast30DaysRefunds = refunded_transactions.reduce((acc, cur) => {
      const account = cur.split_accounts.find(
        (account) => account.account_id === user_id,
      );

      if (!account) return acc;

      return acc + account.amount_refunded;
    }, 0);

    return {
      balance: {
        total_balance: balance?.total_balance,
        pending_balance: balance?.pending_balance,
        available_balance: balance?.available_balance,
      },
      metrics: {
        last_30_days_sales: userLast30DaysSales,
        last_30_days_refunds: userLast30DaysRefunds,
      },
    };
  }
}
