import { ProductsRepository } from '@/domain/repositories/products.repository';
import { Products } from '@/infra/database/entities/products.entity';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class FindProductByShortIdCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(short_id: string): Promise<Products> {
    const product = this.productsRepository.findOne({
      where: {
        short_id,
      },
      select: {
        id: true,
        image: true,
        title: true,
        description: true,
        currency: true,
        sale_disabled: true,
        producer_name: true,
        support_email: true,
        price: true,
      },
      relations: ['preferences'],
    });

    if (!product) {
      throw new ClientException('Produto não encontrado');
    }

    return product;
  }
}
