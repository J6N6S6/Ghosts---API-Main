import { ProductPreferences } from '@/domain/models/product_preferences.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsPreferencesRepository } from '@/domain/repositories/products_preferences.repository';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
import { ProductsLinksRepository } from '@/domain/repositories';
import { ListProductOrderbumpsDTO } from './list_product_orderbumps.dto';

@Injectable()
export class ListProductOrderbumpsCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsPreferencesRepository: ProductsPreferencesRepository,
    private readonly productsLinksRepository: ProductsLinksRepository,
  ) {}

  async execute({
    product_id,
    user_id,
  }: ListProductOrderbumpsDTO): Promise<any> {
    let product = await this.productsRepository.findOne({
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
      relations: ['preferences'],
    });

    if (!product) {
      throw new ClientException('Produto não encontrado');
    }

    if (!product.preferences) {
      const productPreferences = new ProductPreferences({
        product_id: product.id,
      });

      await this.productsPreferencesRepository.create(productPreferences);
      product = await this.productsRepository.findOne({
        where: { id: product_id },
        relations: ['preferences'],
      });
    }

    const orderbumps = await Promise.all(
      product.preferences.orderbumps.map(async (orderbump) => {
        const [product, link] = await Promise.all([
          this.productsRepository.findOne({
            where: { id: orderbump.bump_id },
            select: {
              title: true,
              price: true,
            },
          }),
          this.productsLinksRepository.findOne({
            where: {
              product_id: orderbump.bump_id,
              short_id: orderbump.product_link,
            },
            select: {
              id: true,
              price: true,
              status: true,
            },
          }),
        ]);

        return {
          ...orderbump,
          product_title: product.title,
          product_price: product.price,
          product_link: link,
          user_type: product.owner_id === user_id ? 'owner' : 'coproducer',
        };
      }),
    );

    return orderbumps;
  }
}
