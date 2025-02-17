import { Product } from '@/domain/models/product.model';
import { ProductsLinksRepository } from '@/domain/repositories';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { ProductsService } from '../../services/products.service';

@Injectable()
export class SendProductToRevisionCase {
  constructor(
    private readonly productsRepository: ProductsRepository,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async execute(product_id: string): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: product_id },
    });

    if (!product) throw new ClientException('Produto não encontrado');

    const productModel = new Product({ ...product, status: 'IN_REVIEW' });

    await this.productsRepository.update(productModel);
  }
}
