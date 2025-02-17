import { ClientException } from '@/infra/exception/client.exception';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { Injectable } from '@nestjs/common';
import {
  GetUserRevenueDto,
  GetUserRevenueResponse,
} from './get_user_revenue.dto';
import * as dayjs from 'dayjs';
@Injectable()
export class GetUserRevenueCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute({
    end_date,
    product_id,
    start_date,
    userId,
  }: GetUserRevenueDto): Promise<GetUserRevenueResponse> {
    //  Tirar 3 horas da data final para pegar o último dia completo
    // if (start_date) start_date = dayjs(start_date).add(-3, 'hour').toDate();
    // if (end_date) end_date = dayjs(end_date).add(-3, 'hour').toDate();

    try {
      const product = await this.productsRepository.findById(product_id);

      if (product_id && product && product.owner_id !== userId) {
        throw new ClientException('Product not found');
      }

      const transactions = await this.transactionsRepository.query(
        `SELECT *
         FROM transactions
         WHERE date_approved BETWEEN $1 AND $2
         AND (
           seller_id = $3
           OR EXISTS (
             SELECT 1
             FROM jsonb_array_elements(split_accounts) AS x
             WHERE x->>'account_id' = $4
           )
         )
         ORDER BY date_approved ASC
         `,
        [start_date, end_date, userId, userId],
      );

      let total_revenue = 0;
      let total_transactions_approved = 0;
      let total_refunded = 0;
      let total_transactions_refunded = 0;

      for (const transaction of transactions) {
        const split = transaction.split_accounts.find(
          (split) => split.account_id === userId,
        );

        if (
          transaction.status === 'APPROVED' ||
          transaction.status === 'AUTHORIZED'
        ) {
          total_revenue += split.amount_paid;
          total_transactions_approved += 1;
        } else if (
          transaction.status === 'REFUNDED' ||
          transaction.status === 'CHARGEBACK' ||
          transaction.status === 'CHARGEBACK_BANK' ||
          transaction.status === 'CHARGEBACK_CLIENT'
        ) {
          total_refunded += split.amount_refunded || 0;
          total_transactions_refunded += 1;
        }
      }

      const total_percent_refunded =
        total_transactions_refunded + total_transactions_approved === 0
          ? '0.00'
          : (
              (total_transactions_refunded /
                (total_transactions_approved + total_transactions_refunded)) *
              100
            ).toFixed(2);

      return {
        hasError: false,
        data: {
          total_revenue,
          total_refunded,
          total_percent_refunded,
          total_transactions_approved,
          total_transactions_refunded,
        },
      };
    } catch (err) {
      console.log(err);
      throw new ClientException('Ocorreu um erro ao contabilizar a receita!');
    }
  }
}
