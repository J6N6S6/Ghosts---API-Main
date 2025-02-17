import { ProductPreferences } from '@/domain/models/product_preferences.model';
import { Product } from '@/domain/models/product.model';
import {
  ProductsPreferencesRepository,
  ProductsRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { AdminUpdateProductPaymentMethodsDTO } from '../../dtos/AdminUpdateProductPaymentMethods.DTO';

@Injectable()
export class AdminUpdateProductPaymentMethodsCase {
  constructor(
    private readonly productPreferencesRepository: ProductsPreferencesRepository,
  ) {}

  async execute({
    product_id,
    payment_methods,
  }: AdminUpdateProductPaymentMethodsDTO) {
    payment_methods.map((item) => {
      if (item !== 'PIX' && item !== 'BANK_SLIP' && item !== 'CREDIT_CARD') {
        throw new ClientException('Método de pagamento inválido');
      }
    });

    const productPreferences =
      await this.productPreferencesRepository.findByProductId(product_id);

    if (!productPreferences) {
      throw new ClientException('Produto não encontrado');
    }

    const productPreferencesUpdated = new ProductPreferences({
      ...productPreferences,
      payment_method: payment_methods,
    });

    const updated = await this.productPreferencesRepository.update(
      productPreferencesUpdated,
    );

    console.log('UPDATED: ', updated);
  }
}
