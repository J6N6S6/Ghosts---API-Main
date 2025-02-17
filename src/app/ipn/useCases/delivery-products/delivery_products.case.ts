import { Purchase } from '@/domain/models/purchases.model';
import { PurchasesRepository } from '@/domain/repositories/purchases.repository';
import { Injectable } from '@nestjs/common';
import { DeliveryProductsDTO } from '../../dtos/delivery_products';

@Injectable()
export class DeliveryProductsCase {
  constructor(private readonly purchasesRepository: PurchasesRepository) {}

  async execute({
    user_id,
    product_id,
    transaction_id,
  }: DeliveryProductsDTO): Promise<void> {
    const hasProduct = await this.purchasesRepository.findByUserIdAndProductId(
      user_id,
      product_id,
    );

    if (hasProduct) return;

    const purchase = new Purchase({
      user_id,
      product_id,
      transaction_id,
    });

    await this.purchasesRepository.create(purchase);
  }
}
