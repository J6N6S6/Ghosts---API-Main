import { ClientException } from '@/infra/exception/client.exception';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { GetAdminChartDto, GetUserChartResponse } from './get_admin_chart.dto';

@Injectable()
export class GetAdminChartCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute({
    period = 'today',
  }: GetAdminChartDto): Promise<GetUserChartResponse> {
    if (
      period !== 'today' &&
      period !== '7d' &&
      period !== '14d' &&
      period !== '30d'
    ) {
      throw new ClientException('Invalid period.');
    }

    const start_date =
      period === 'today'
        ? dayjs().startOf('day').add(3, 'hours').toDate()
        : dayjs()
            .subtract(parseInt(period.replace('d', '')), 'day')
            .subtract(3, 'hours')
            .toDate();
    const end_date = dayjs().add(3, 'hours').toDate();

    try {
      const transactions = await this.transactionsRepository.query(
        `SELECT *
         FROM transactions
         WHERE status = $1
         AND date_approved BETWEEN $2 AND $3
         ORDER BY date_approved ASC`,
        ['AUTHORIZED', start_date, end_date],
      );

      const labels = [];
      const data = [];

      const labels_length =
        period === 'today' ? 24 : parseInt(period.replace('d', ''));

      for (let i = 0; i < labels_length; i++) {
        const date =
          period === 'today'
            ? dayjs().hour(i).format('HH:[00]')
            : dayjs().subtract(i, 'day').format('DD/MM/YYYY');

        labels.unshift(date);
        data.unshift(0);
      }

      for (const t of transactions) {
        const date = dayjs(t.date_approved)
          .subtract(3, 'hours')
          .format(period === 'today' ? 'HH:[00]' : 'DD/MM/YYYY');

        const index = labels.findIndex((l) => l === date);

        // Acumular o valor total de cada transação
        // @ts-ignore
        data[index] += t.transaction_amount;
      }

      return {
        hasError: false,
        data: {
          labels: period === 'today' ? labels.reverse() : labels,
          data: period === 'today' ? data.reverse() : data,
        },
      };
    } catch (err) {
      throw new ClientException(err.message);
    }
  }
}
