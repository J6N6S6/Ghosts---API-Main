import { ProductPreferences } from '@/domain/models/product_preferences.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsPreferencesRepository } from '@/domain/repositories/products_preferences.repository';
import { ProductsPreferences } from '@/infra/database/entities/products_preferences.entity';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
import { updateCheckoutDataDTO } from '../../dtos/UpdateCheckoutDataDTO';

@Injectable()
export class UpdateProductCheckoutCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsPreferencesRepository: ProductsPreferencesRepository,
  ) {}

  async execute({
    product_id,
    allow_payment_with_two_cards,
    back_redirect_url,
    countdown,
    inputs_checkout,
    notifications,
    payment_method,
    repeat_email_in_checkout,
    upsell_url,
    whatsapp_link,
    color_section,
    purchase_button,
  }: updateCheckoutDataDTO): Promise<ProductsPreferences> {
    const product = await this.productsRepository.findOne({
      where: { id: product_id },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new ClientException('Produto não encontrado');
    }

    if (product.status === 'BLOCKED')
      throw new ClientException(
        'Sem permissão para executar essa ação, produto bloqueado!',
      );

    const productPreferences =
      await this.productsPreferencesRepository.findByProductId(product_id);

    const preferencesModel = new ProductPreferences(
      productPreferences
        ? productPreferences
        : {
            product_id,
          },
    );

    if (typeof allow_payment_with_two_cards === 'boolean') {
      preferencesModel.allow_payment_with_two_cards =
        allow_payment_with_two_cards;
    }

    if (back_redirect_url) {
      preferencesModel.back_redirect_url = back_redirect_url;
    }

    if (countdown) {
      preferencesModel.countdown = countdown;
    }

    if (inputs_checkout) {
      preferencesModel.inputs_checkout = inputs_checkout;
    }

    if (notifications) {
      preferencesModel.notifications = notifications;
    }

    if (payment_method) {
      preferencesModel.payment_method = payment_method;
    }

    if (typeof repeat_email_in_checkout === 'boolean') {
      preferencesModel.repeat_email_in_checkout = repeat_email_in_checkout;
    }

    if (upsell_url || upsell_url === null) {
      preferencesModel.upsell_url = upsell_url;
    }

    if (whatsapp_link || whatsapp_link === null) {
      preferencesModel.whatsapp_link = whatsapp_link;
    }

    if (color_section || color_section === null) {
      preferencesModel.color_section = color_section;
    }

    if (purchase_button) {
      preferencesModel.purchase_button = purchase_button;
    }

    if (!productPreferences)
      return await this.productsPreferencesRepository.create(preferencesModel);

    await this.productsPreferencesRepository.update(preferencesModel);
  }
}
