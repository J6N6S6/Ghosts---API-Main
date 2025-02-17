import { PurchasesRepository } from '@/domain/repositories/purchases.repository';
import { Injectable } from '@nestjs/common';
import { RemoveProductsDTO } from '../../dtos/remove_products';

@Injectable()
export class RemoveProductsCase {
  constructor(private readonly purchasesRepository: PurchasesRepository) {}

  async execute({ user_id, transaction_id }: RemoveProductsDTO): Promise<void> {
    const products = await this.purchasesRepository.findAllByTransactionId(
      transaction_id,
    );

    if (!products) return;

    products.forEach(async (product) => {
      if (user_id && product.user_id !== user_id) return;
      await this.purchasesRepository.delete(product.id);
    });
  }
}
