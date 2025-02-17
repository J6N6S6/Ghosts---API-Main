import { ProductsRepository } from '@/domain/repositories/products.repository';
import { Injectable } from '@nestjs/common';
import { GetUserProductDTO } from './get_user_product.dto';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class GetUserProductCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({ product_id, user_id }: GetUserProductDTO) {
    const product = await this.productsRepository.findAll({
      where: [
        {
          id: product_id,
          owner_id: user_id,
        },
        {
          id: product_id,
          coproducers: {
            user_id,
          },
        },
      ],
      select: {
        category: {
          id: true,
          title: true,
        },
      },
      relations: ['category'],
    });

    if (!product) throw new ClientException('Produto não encontrado');

    return product;
  }
}
