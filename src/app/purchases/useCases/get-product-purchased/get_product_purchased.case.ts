import { ProductsRepository } from '@/domain/repositories';
import { PurchasesRepository } from '@/domain/repositories/purchases.repository';
import { Injectable } from '@nestjs/common';
import { GetProductPurchasedDTO } from './get_product_purchased.dto';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class GetProductPurchasedCase {
  constructor(
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute({ product_id, user_id }: GetProductPurchasedDTO) {
    const purchase = await this.purchasesRepository.findBy({
      where: { user_id, product_id },
      relations: ['product', 'product.category', 'product.owner'],
      select: {
        id: true,
        user_id: true,
        evaluation: true,
        transaction_id: true,
        product: {
          id: true,
          title: true,
          product_type: true,
          image: true,
          category: {
            id: true,
            title: true,
          },
          owner: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!purchase) throw new ClientException('Product not purchased');

    return purchase;
  }
}
