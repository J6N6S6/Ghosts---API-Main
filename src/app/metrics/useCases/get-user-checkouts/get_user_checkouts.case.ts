import { ClientException } from '@/infra/exception/client.exception';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { TransactionsBuyersRepository } from '@/domain/repositories/transactions_buyers.repository';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Between } from 'typeorm';
import {
  GetUserCheckoutsDto,
  GetUserCheckoutsResponse,
} from './get_user_checkouts.dto';

@Injectable()
export class GetUserCheckoutsCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly transactionsBuyersRepository: TransactionsBuyersRepository,
  ) {}

  async execute({
    end_date,
    product_id,
    start_date,
    userId,
  }: GetUserCheckoutsDto): Promise<GetUserCheckoutsResponse> {
    try {
      const product = await this.productsRepository.findById(product_id);

      if (product_id && product && product.owner_id !== userId) {
        throw new ClientException('Product not found');
      }

      const checkouts = await this.transactionsBuyersRepository.findAll({
        where: {
          product_id: product_id || undefined,
          created_at: Between(
            dayjs(start_date).startOf('day').toDate(),
            dayjs(end_date).endOf('day').toDate(),
          ),
          Transaction: {
            seller_id: userId,
          },
        },
        relations: ['Transaction'],
      });

      let checkouts_open = 0;
      let checkouts_canceled = 0;
      let checkouts_approved = 0;

      for (const checkout of checkouts) {
        if (
          !checkout.Transaction &&
          dayjs().isAfter(dayjs(checkout.created_at).add(1, 'day'))
        ) {
          checkouts_canceled += 1;
          continue;
        }

        if (checkout.Transaction) {
          checkouts_approved += 1;
          continue;
        }

        checkouts_open += 1;
      }

      return {
        hasError: false,
        data: {
          checkouts_open,
          checkouts_canceled,
          checkouts_approved,
        },
      };
    } catch (err) {
      console.log(err);
      throw new ClientException('Ocorreu um erro ao carregar os checkouts');
    }
  }
}
