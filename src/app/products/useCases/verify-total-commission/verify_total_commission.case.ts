import { ProductsRepository } from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerifyTotalCommissionCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(product_id: string) {
    const product = await this.productsRepository.findOne({
      where: {
        id: product_id,
      },
      relations: ['coproducers'],
    });

    if (!product) throw new ClientException('Product not found');

    let totalCommissions = 0;

    // Calculate total commissions for coproducers
    totalCommissions += product.coproducers.reduce(
      (acc, coProducer) => acc + coProducer.commission,
      0,
    );

    // Calculate total commissions for affiliates
    if (product.allow_affiliate)
      totalCommissions += product.affiliate_commission;

    return totalCommissions;
  }
}
