import { ClientException } from '@/infra/exception/client.exception';
import {
  TransactionsRepository,
  UsersRepository,
  WithdrawalsRepository,
} from '@/domain/repositories';
import { Transactions } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { Between, FindOptionsWhere, In, ILike, MoreThan } from 'typeorm';
import { listAllAdminTransactionsDTO } from '../../dtos/listAllAdminTransactionsDTO';
@Injectable()
export class ListAdminTransactionsMetricsCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly usersRepository: UsersRepository,

    private readonly withdrawalsRepository: WithdrawalsRepository,
  ) {}

  async execute({
    page = 1,
    items_per_page = 10,
    links = 'all',
    payment_method = 'all',
    products = 'all',
    start_date,
    end_date,
    status = 'all',
    utm_campaign,
    utm_content,
    utm_medium,
    utm_source,
    utm_term,
    search,
  }: listAllAdminTransactionsDTO) {
    try {
      if (items_per_page < 10 || items_per_page > 100)
        throw new ClientException(
          'A quantidade de items por pagina deve ser entre 10 e 100',
        );

      const query_where: FindOptionsWhere<Transactions> = {
        transaction_amount: MoreThan(0),
      };

      if (status)
        query_where.status =
          status === 'all'
            ? In([
                'AUTHORIZED',
                'REFUNDED',
                'IN_DISPUTE',
                'CHARGEBACK',
                'PENDING',
                'REJECTED',
                'DISPUTE_ACCEPTED',
                'DISPUTE_REJECTED',
              ])
            : In(status);
      if (products)
        query_where.product_id =
          products === 'all' ? undefined : In(products ?? []);
      if (payment_method)
        query_where.payment_method =
          payment_method === 'all' ? undefined : In(payment_method ?? []);
      if (start_date && end_date)
        query_where.date_created = Between(
          new Date(start_date),
          new Date(end_date),
        );
      if (utm_source || utm_medium || utm_campaign || utm_term || utm_content)
        query_where.buyer = {
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content,
        };
      if (links)
        query_where.product_link =
          links === 'all' ? undefined : In(links ?? []);

      let final_query_where: FindOptionsWhere<Transactions>[] = query_where
        ? [query_where]
        : [];

      if (search) {
        final_query_where = [
          {
            ...query_where,
            id: ILike(`%${search}%`),
          },
          {
            ...query_where,
            buyer: [
              {
                name: ILike(`%${search}%`),
              },
              {
                email: ILike(`%${search}%`),
              },
              {
                phone: ILike(`%${search}%`),
              },
            ],
          },
          {
            ...query_where,
            seller: [
              {
                name: ILike(`%${search}%`),
              },
              {
                email: ILike(`%${search}%`),
              },
            ],
          },
        ];
      }
      const [total_transactions, withdrawals, total_comission] =
        await Promise.all([
          this.transactionsRepository.findAll({
            where: {
              status: In([
                'AUTHORIZED',
                'REFUNDED',
                'IN_DISPUTE',
                'CHARGEBACK',
              ]),
            },
            select: {
              status: true,
              transaction_amount: true,
              split_accounts: true,
            },
          }),
          this.withdrawalsRepository.count({
            where: {
              status: 'approved',
            },
          }),
          this.transactionsRepository.query(
            `SELECT COALESCE(SUM((elem->>'amount')::numeric), 0) AS total_amount FROM transactions, LATERAL jsonb_array_elements(split_accounts) AS elem WHERE elem->>'paid'='true';`,
          ),
        ]);

      const plataform_comission =
        total_transactions
          .filter(
            (t) =>
              t.status === 'AUTHORIZED' ||
              t.status === 'CHARGEBACK' ||
              t.status === 'IN_DISPUTE',
          )
          .reduce(
            (acc, cur) => {
              switch (cur.status) {
                case 'AUTHORIZED':
                  return acc + Number(cur.transaction_amount);

                case 'CHARGEBACK':
                case 'IN_DISPUTE':
                  return (
                    acc +
                    cur.split_accounts.reduce((a, c) => a + c.penality || 0, 0)
                  );

                default:
                  return acc;
              }
            },
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
            Number(-total_comission[0].total_amount),
          ) +
        withdrawals * 3.49;

      return {
        total_transactions: {
          approved: total_transactions.filter((i) => i.status === 'AUTHORIZED')
            .length,
          refunded: total_transactions.filter((i) => i.status === 'REFUNDED')
            .length,
        },
        plataform_comission: Number(plataform_comission.toFixed(2)),
      };
    } catch (error) {
      console.log(error);
      throw new ClientException(error.message);
    }
  }
}
