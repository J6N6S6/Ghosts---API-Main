import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { GetGeneralSettingsDTO } from './get_general_settings.dto';

@Injectable()
export class GetGeneralSettingsCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({ product_id, user_id }: GetGeneralSettingsDTO) {
    const product = await this.productsRepository.findOne({
      where: { id: product_id, owner_id: user_id },
      select: {
        id: true,
        short_id: true,
        affiliate_assignment: true,
        affiliate_automatically_approve: true,
        affiliate_commission: true,
        affiliate_commission_orderbump: true,
        affiliate_receive_mail: true,
        allow_affiliate: true,
        allow_marketplace: true,
        marketplace_checkout_link: true,
        marketplace_description: true,
        marketplace_support_email: true,
        marketplace_link: {
          price: true,
          title: true,
          status: true,
        },
      },
      relations: ['marketplace_link'],
    });

    if (!product) throw new ClientException('Produto não encontrado');

    return product;
  }
}
