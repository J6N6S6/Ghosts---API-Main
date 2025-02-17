import { ProductPreferences } from '@/domain/models/product_preferences.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsPreferencesRepository } from '@/domain/repositories/products_preferences.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { GetProductCheckoutDTO } from './get_product_checkout.dto';

@Injectable()
export class GetProductCheckoutCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsPreferencesRepository: ProductsPreferencesRepository,
  ) {}

  async execute({ product_id, user_id }: GetProductCheckoutDTO): Promise<any> {
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

    return {
      ...product.preferences,
      primary_banner: product.primary_banner,
      secondary_banner: product.secondary_banner,
      user_type: product.owner_id === user_id ? 'owner' : 'coproducer',
    };
  }
}
