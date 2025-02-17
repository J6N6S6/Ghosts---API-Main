import {
  ProductsAffiliatesRepository,
  ProductsRepository,
} from '@/domain/repositories';
import { ProductsLinksRepository } from '@/domain/repositories/products_links.repository';
import { ProductsLinks } from '@/infra/database/entities/products_links.entity';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { ListProductLinksDTO } from './list_product_links.dto';

@Injectable()
export class ListProductLinksCase {
  constructor(
    private readonly productsLinksRepository: ProductsLinksRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly productsAffiliatesRepository: ProductsAffiliatesRepository,
  ) {}

  async execute({
    product_id,
    user_id,
  }: ListProductLinksDTO): Promise<ProductsLinks[]> {
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
        {
          id: product_id,
          affiliates: {
            user_id,
            product_id,
            status: 'ACCEPTED',
            blocked: false,
          },
        },
      ],
      select: ['id', 'owner_id'],
      loadRelationIds: {
        relations: ['coproducers'],
      },
    });

    if (!product) throw new ClientException('Produto não encontrado');

    const userIsProducerOrCoproducer =
      // @ts-expect-error - coproducer is array of strings
      product.owner_id === user_id || product.coproducers.includes(user_id);
    let affiliate_id = null;

    if (!userIsProducerOrCoproducer) {
      const productAffiliate = await this.productsAffiliatesRepository.findOne({
        where: {
          user_id,
          product_id,
          status: 'ACCEPTED',
          blocked: false,
        },
      });

      if (!productAffiliate) {
        throw new ClientException('Produto não encontrado');
      }

      affiliate_id = productAffiliate.id;
    }

    const products_links = await this.productsLinksRepository.findAll({
      where: {
        product_id,
        allow_affiliation: affiliate_id ? true : undefined,
      },
    });

    const productsLinkFinal = affiliate_id
      ? products_links.map((product) => {
          return {
            ...product,
            affiliate_id,
          };
        })
      : products_links;

    return productsLinkFinal;
  }
}
