import { Product } from '@/domain/models/product.model';
import { ProductsLinksRepository } from '@/domain/repositories';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UpdateGeneralSettingsDTO } from './update_general_settings.dto';
import { ProductsService } from '../../services/products.service';

@Injectable()
export class UpdateGeneralSettingsCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsLinksRepository: ProductsLinksRepository,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async execute({
    product_id,
    user_id,
    affiliate_assignment,
    affiliate_automatically_approve,
    affiliate_commission,
    affiliate_commission_orderbump,
    allow_affiliate,
    allow_marketplace,
    marketplace_checkout_link,
    marketplace_description,
    marketplace_support_email,
  }: UpdateGeneralSettingsDTO): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: product_id, owner_id: user_id },
    });

    if (!product) throw new ClientException('Produto não encontrado');

    const productModel = new Product(product);

    if (typeof allow_affiliate === 'boolean')
      productModel.allow_affiliate = allow_affiliate;
    if (typeof allow_marketplace === 'boolean')
      productModel.allow_marketplace = allow_marketplace;
    if (typeof affiliate_automatically_approve === 'boolean')
      productModel.affiliate_automatically_approve =
        affiliate_automatically_approve;
    if (affiliate_assignment)
      productModel.affiliate_assignment = affiliate_assignment;
    if (affiliate_commission) {
      const commissionTotal = await this.productsService.verifyTotalCommission(
        product_id,
      );

      const oldCommissions =
        commissionTotal - productModel.affiliate_commission || 0;

      if (oldCommissions + affiliate_commission > 80)
        throw new ClientException(
          'Comissão total não pode ser maior que 80%, verifique as comissões dos co-produtores e afiliados',
        );

      productModel.affiliate_commission = affiliate_commission;
    }
    if (affiliate_commission_orderbump)
      productModel.affiliate_commission_orderbump =
        affiliate_commission_orderbump;
    if (marketplace_checkout_link || marketplace_checkout_link === null) {
      if (marketplace_checkout_link !== null) {
        const link = await this.productsLinksRepository.findById(
          marketplace_checkout_link,
        );

        if (!link) throw new ClientException('Link não encontrado');
        if (link.product_id !== product_id)
          throw new ClientException('Link não pertence ao produto');
        if (link.type !== 'CHECKOUT')
          throw new ClientException('Link não é de checkout');

        productModel.marketplace_checkout_link = marketplace_checkout_link;
      } else {
        productModel.marketplace_checkout_link = null;
      }
    }

    if (marketplace_description)
      productModel.marketplace_description = marketplace_description;

    if (marketplace_support_email)
      productModel.marketplace_support_email = marketplace_support_email;

    await this.productsRepository.update(productModel);
  }
}
