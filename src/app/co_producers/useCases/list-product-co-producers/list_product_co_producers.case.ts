import { CoProducersRepository } from '@/domain/repositories/co_producers.repository';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { ListProductCoProducersDTO } from './list_product_co_producers.dto';

@Injectable()
export class ListProductCoProducersCase {
  constructor(
    private readonly coProducersRepository: CoProducersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute({ product_id, user_id }: ListProductCoProducersDTO) {
    const product = await this.productsRepository.findOne({
      where: [
        { id: product_id, owner_id: user_id },
        {
          id: product_id,
          coproducers: {
            user_id,
            product_id,
            accepted: true,
          },
        },
      ],
    });

    if (!product) throw new ClientException('Produto não encontrado');

    const coprods = await this.coProducersRepository.find({
      where: {
        product_id,
      },
      relations: ['user'],
      select: {
        id: true,
        accepted: true,
        joinedAt: true,
        commission: true,
        commission_orderbump: true,
        user: {
          id: true,
          name: true,
          email: true,
          photo: true,
        },
      },
    });

    return coprods;
  }
}
