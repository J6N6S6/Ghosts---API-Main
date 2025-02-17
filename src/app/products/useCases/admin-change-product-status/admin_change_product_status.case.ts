import { Product } from '@/domain/models/product.model';
import { ProductsRepository } from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { AdminChangeProductStatusDTO } from './admin_change_product_status.dto';

@Injectable()
export class AdminChangeProductStatusCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    product_id,
    status,
    status_reason,
  }: AdminChangeProductStatusDTO) {
    const product = await this.productsRepository.findOne({
      where: {
        id: product_id,
      },
    });

    if (!product) {
      throw new ClientException('Produto não encontrado');
    }

    const productOrder = new Product(product);

    if (productOrder.status === status) {
      throw new ClientException('Status do produto já está como informado');
    }

    productOrder.status = status;
    productOrder.status_reason = status_reason || null;

    await this.productsRepository.update(productOrder);
  }
}
