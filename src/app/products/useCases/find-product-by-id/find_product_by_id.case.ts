import { ProductsRepository } from '@/domain/repositories/products.repository';
import { Products } from '@/infra/database/entities/products.entity';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
import {
  CoProducersRepository,
  ProductsAffiliatesRepository,
} from '@/domain/repositories';

interface IResponse extends Products {
  user_association: string;
}

@Injectable()
export class FindProductByIdCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly coProducersRepository: CoProducersRepository,
    private readonly productsAffiliatesRepository: ProductsAffiliatesRepository,
  ) {}

  async execute(product_id: string, user_id?: string): Promise<IResponse> {
    const product = await this.productsRepository.findOne({
      where: { id: product_id },
      relations: ['content'],
    });

    if (!product) {
      throw new ClientException('Produto não encontrado');
    }

    let user_association = product.owner_id === user_id ? 'PRODUCER' : null;

    if (user_id && user_association === null) {
      const coProducer = await this.coProducersRepository.findBy({
        product_id,
        user_id,
        accepted: true,
      });

      if (coProducer) {
        user_association = 'COPRODUCER';
      } else {
        const affiliation = await this.productsAffiliatesRepository.find({
          where: {
            product_id,
            user_id,
            blocked: false,
            status: 'ACCEPTED',
          },
        });

        if (affiliation) {
          user_association = 'AFFILIATE';
        } else {
          throw new ClientException('Produto não encontrado');
        }
      }
    }

    return {
      ...product,
      user_association,
    };
  }
}
