import { ClientException } from '@/infra/exception/client.exception';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { Between } from 'typeorm';
import { listAllUserTransactionsDTO } from '../../dtos/listAllUserTransactionsDTO';
import { ProductsRepository } from '@/domain/repositories/products.repository';

@Injectable()
export class ListUserTransactionsCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    filters,
    user_id,
    page,
    items_per_page,
  }: listAllUserTransactionsDTO) {
    if (items_per_page < 10 || items_per_page > 100)
      throw new ClientException(
        'A quantidade de items por pagina deve ser entre 10 e 100',
      );

    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ClientException('Usuário não encontrado');

    const transactions = await this.transactionsRepository.findAll({
      where: {
        date_created:
          filters.from_date && filters.to_date
            ? Between(new Date(filters.from_date), new Date(filters.to_date))
            : undefined,
        buyer: {
          email: user.email,
        },
      },
      select: {
        id: true,
        product: {
          title: true,
        },
        seller: {
          name: true,
          email: true,
        },
        transaction_amount: true,
        status: true,
        date_created: true,
        date_approved: true,
        transaction_details: {
          net_received_amount: true,
          total_paid_amount: true,
          overpaid_amount: true,
          external_transaction_id: true,
        },
        card: true,
        payment_method: true,
        additional_products: true,
      },
      skip: (page - 1) * items_per_page,
      take: items_per_page,
    });

    const finalTransactions = [];

    for (const transaction of transactions) {
      const order_bump = [];

      for (const order_bump_id of transaction.additional_products) {
        const order_bump_product = await this.productsRepository.findById(
          order_bump_id.product_id,
        );

        if (!order_bump_product) continue;

        order_bump.push({
          id: order_bump_product.id,
          title: order_bump_product.title,
          price: order_bump_product.price,
        });
      }

      finalTransactions.push({
        ...transaction,
        order_bumps: order_bump,
      });
    }

    return finalTransactions;
  }
}
