import { ClientException } from '@/infra/exception/client.exception';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { Injectable } from '@nestjs/common';
import { GetUserSalesDto, GetUserSalesResponse } from './get_user_sales.dto';

@Injectable()
export class GetUserSalesCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute({
    end_date,
    product_id,
    start_date,
    userId,
  }: GetUserSalesDto): Promise<GetUserSalesResponse> {
    try {
      const product = await this.productsRepository.findById(product_id);

      if (product_id && product && product.owner_id !== userId) {
        throw new ClientException('Produto não encontrado');
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

      const credit_card_data = {
        total_transactions_approved: 0,
        total_transactions_canceled: 0,
        total_percent_conversion: '0',
      };

      const bank_slip_data = {
        total_transactions_approved: 0,
        total_transactions_generated: 0,
        total_percent_conversion: '0',
      };

      const pix_data = {
        total_transactions_approved: 0,
        total_transactions_generated: 0,
        total_percent_conversion: '0',
      };

      transactions.forEach((transaction) => {
        if (transaction.payment_method === 'CREDIT_CARD') {
          if (
            transaction.status === 'APPROVED' ||
            transaction.status === 'AUTHORIZED'
          )
            credit_card_data.total_transactions_approved += 1;
          else if (transaction.status === 'CANCELED')
            credit_card_data.total_transactions_canceled += 1;
        } else if (transaction.payment_method === 'BANK_SLIP') {
          bank_slip_data.total_transactions_generated += 1;

          if (
            transaction.status === 'APPROVED' ||
            transaction.status === 'AUTHORIZED'
          )
            bank_slip_data.total_transactions_approved += 1;
        } else if (transaction.payment_method === 'PIX') {
          pix_data.total_transactions_generated += 1;

          if (
            transaction.status === 'APPROVED' ||
            transaction.status === 'AUTHORIZED'
          )
            pix_data.total_transactions_approved += 1;
        }
      });

      if (credit_card_data.total_transactions_approved > 0)
        credit_card_data.total_percent_conversion = (
          (credit_card_data.total_transactions_approved /
            (credit_card_data.total_transactions_approved +
              credit_card_data.total_transactions_canceled)) *
          100
        ).toFixed(2);

      if (bank_slip_data.total_transactions_approved > 0)
        bank_slip_data.total_percent_conversion = (
          (bank_slip_data.total_transactions_approved /
            bank_slip_data.total_transactions_generated) *
          100
        ).toFixed(2);

      if (pix_data.total_transactions_approved > 0)
        pix_data.total_percent_conversion = (
          (pix_data.total_transactions_approved /
            pix_data.total_transactions_generated) *
          100
        ).toFixed(2);

      return {
        hasError: false,
        data: {
          credit_card: credit_card_data,
          bank_slip: bank_slip_data,
          pix: pix_data,
        },
      };
    } catch (err) {
      console.log(err);
      throw new ClientException('Ocorreu um erro ao carregar vendas');
    }
  }
}
