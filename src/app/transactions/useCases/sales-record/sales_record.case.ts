import { ProductsRepository } from '@/domain/repositories/products.repository';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { Transactions } from '@/infra/database/entities/transactions.entity';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { Between, FindOptionsWhere, In, ILike, Raw } from 'typeorm';
import { listAllTransactionsDTO } from '../../dtos/listAllTransactionsDTO';
import * as dayjs from 'dayjs';

@Injectable()
export class SalesRecordCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    user_id,
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
  }: listAllTransactionsDTO) {
    if (items_per_page < 10 || items_per_page > 100)
      throw new ClientException(
        'A quantidade de items por pagina deve ser entre 10 e 100',
      );

    const query_where: FindOptionsWhere<Transactions> = {
      split_accounts: Raw(
        () => `EXISTS (
        SELECT 1
        FROM jsonb_array_elements(split_accounts) AS x
        WHERE x->>'account_id' = '${user_id}' OR x->>'seller_id' = '${user_id}'
      )`,
      ),
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
      query_where.product_link = links === 'all' ? undefined : In(links ?? []);

    let final_query_where: FindOptionsWhere<Transactions>[] = [query_where];

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
      ];
    }

    const total_amount_query = {
      seller_id: user_id,
    };

    if (status && status !== 'all') {
      total_amount_query['status'] = In(status);
    }

    if (payment_method && payment_method !== 'all') {
      total_amount_query[`payment_method`] = In(payment_method ?? []);
    }

    if (start_date && end_date) {
      total_amount_query[`date_created`] = Between(
        new Date(start_date),
        new Date(end_date),
      );
    }

    if (products && products !== 'all') {
      total_amount_query['product_id'] = In(products ?? []);
    }

    const total_amount =
      await this.transactionsRepository.getTotalTransactionAmount(
        total_amount_query,
      );

    const [
      transactions,
      transactions_count,
      last_30days_sales,
      sales_approved,
      sales_pending,
    ] = await Promise.all([
      this.transactionsRepository.findAll({
        where: final_query_where,
        relations: ['product', 'buyer'],
        select: {
          id: true,
          date_created: true,
          date_approved: true,
          seller_id: true,
          status: true,
          payment_method: true,
          product: {
            id: true,
            title: true,
            price: true,
          },
          split_accounts: true,
          buyer: {
            utm_source: true,
            utm_medium: true,
            utm_campaign: true,
            utm_term: true,
            utm_content: true,
            name: true,
            document: true,
            email: true,
            address: {
              street: true,
              number: true,
              neighborhood: true,
              city: true,
              state: true,
              cep: true,
            },
            phone: true,
          },
          transaction_amount: true,
          card: true,
        },
        skip: (page - 1) * items_per_page,
        take: items_per_page,
        order: {
          date_created: 'DESC',
          date_approved: 'DESC',
        },
      }),
      this.transactionsRepository.count({
        where: final_query_where,
      }),
      this.transactionsRepository.count({
        where: {
          date_created: Between(
            new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), //30 dias
            new Date(),
          ),
          split_accounts: Raw(
            () => `EXISTS (
              SELECT 1
              FROM jsonb_array_elements(split_accounts) AS x
              WHERE x->>'account_id' = '${user_id}' OR x->>'seller_id' = '${user_id}'
            )`,
          ),
          status: 'AUTHORIZED',
        },
      }),
      this.transactionsRepository.count({
        where: final_query_where.map((f) => ({ ...f, status: 'AUTHORIZED' })),
      }),
      this.transactionsRepository.count({
        where: final_query_where.map((f) => ({
          ...f,
          status: In(['PENDING', 'WAITING_PAYMENT']),
        })),
      }),
    ]);

    const participants_info = [];
    const transactions_complete = [];

    for (const transaction of transactions) {
      const participants_splits = transaction.split_accounts.filter(
        (i) => i.account_type !== 'seller' && i.account_type !== 'inviter',
      );

      if (participants_splits.length > 0) {
        const participants_ids = participants_splits.map((i) => i.account_id);

        //verificar se os id dos participantes já estão na lista

        const participants_users = await this.usersRepository.find({
          where: {
            id: In(
              participants_ids.filter((i) => !participants_info.includes(i)),
            ),
          },
          select: {
            id: true,
            name: true,
            email: true,
            photo: true,
          },
        });

        for (const participant of participants_users) {
          //verificar se o participante já está na lista
          const participant_exists = participants_info.find(
            (i) => i.id === participant.id,
          );

          if (!participant_exists) {
            participants_info.push({
              id: participant.id,
              name: participant.name,
              email: participant.email,
              photo: participant.photo,
            });
          }
        }
      }

      const final_participants = participants_splits.map((i) => {
        const participant = participants_info.find(
          (j) => j.id === i.account_id,
        );

        return {
          id: participant.id,
          name: participant.name,
          email: participant.email,
          photo: participant.photo,
          amount_paid: i.amount_paid,
          amount: i.amount,
        };
      });

      const user_split = transaction.split_accounts.find(
        (i) => i.account_id === user_id,
      );

      transactions_complete.push({
        ...transaction,
        split_accounts: undefined,
        comission: user_split.amount ?? 0,
        participants: final_participants,
        transaction_type:
          transaction.seller_id === user_id ? 'producer' : 'co_producer',
        money_release: transaction.status === 'AUTHORIZED' ? true : false,
        money_release_date: dayjs(
          transaction.date_approved || transaction.date_created,
        ).add(user_split.days_to_receive ?? 0, 'day'),
      });
    }

    return {
      transactions: transactions_complete,
      total_items: transactions_count,
      total_pages: Math.ceil(transactions_count / items_per_page),
      total_amount: Number(total_amount.toFixed(2)),
      current_page: page,
      last_30days_sales,
      sales_approved,
      sales_pending,
    };
  }
}
