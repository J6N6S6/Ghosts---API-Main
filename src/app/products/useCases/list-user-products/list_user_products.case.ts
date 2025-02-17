import { ProductsRepository } from '@/domain/repositories/products.repository';
import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';

@Injectable()
export class ListUserProductsCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(user_id: string) {
    const options = {
      select: {
        category: {
          id: true,
          title: true,
        },
      },
      relations: ['category', 'content'],
    };

    const [products, co_producer_products, affiliate_products] =
      await Promise.all([
        this.productsRepository.findAll({
          where: {
            owner_id: user_id,
            status: Not('ARCHIVED'),
          },
          ...options,
        }),
        this.productsRepository.findAll({
          where: {
            coproducers: {
              user_id,
            },
            status: Not('ARCHIVED'),
          },
          ...options,
        }),
        this.productsRepository.findAll({
          where: {
            affiliates: {
              user_id,
              status: 'ACCEPTED',
            },
            status: Not('ARCHIVED'),
          },
          ...options,
        }),
      ]);

    return {
      products,
      co_producer_products,
      affiliate_products,
    };
  }
}
