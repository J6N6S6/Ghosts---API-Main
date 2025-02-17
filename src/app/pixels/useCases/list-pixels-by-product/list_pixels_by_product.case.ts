import {
  ProductsAffiliatesRepository,
  ProductsRepository,
} from '@/domain/repositories';
import { ProductsPixelRepository } from '@/domain/repositories/products_pixel.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { ListPixelsByProductDTO } from './list_pixels_by_product.dto';

@Injectable()
export class ListPixelsByProductCase {
  constructor(
    private readonly pixelsRepository: ProductsPixelRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly productsAffiliatesRepository: ProductsAffiliatesRepository,
  ) {}

  async execute({ product_id, user_id }: ListPixelsByProductDTO) {
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
            blocked: false,
            status: 'ACCEPTED',
          },
        },
      ],
      select: ['id', 'owner_id'],
      loadRelationIds: {
        relations: ['coproducers'],
      },
    });

    if (!product) throw new ClientException('Produto não encontrado');

    if (
      product.owner_id !== user_id &&
      // @ts-expect-error - coproducers is array of strings
      !product.coproducers.includes(user_id)
    ) {
      const userIsAffiliate = await this.productsAffiliatesRepository.findOne({
        where: {
          product_id,
          user_id,
          blocked: false,
          status: 'ACCEPTED',
        },
      });

      if (!userIsAffiliate)
        throw new ClientException('Você não é afiliado deste produto');

      return await this.pixelsRepository.find({
        where: { product_id, user_id },
        order: { createdAt: 'DESC' },
      });
    }

    const pixels = await this.pixelsRepository.find({
      where: [
        { product_id, user_id: product.owner_id },
        { product_id, user_id: IsNull() },
      ],
      order: { createdAt: 'DESC' },
    });

    return pixels;
  }
}
