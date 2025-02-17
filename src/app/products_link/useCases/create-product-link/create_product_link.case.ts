import { generateShortId } from '@/app/products/utils/generateShortId';
import { ProductLink } from '@/domain/models/products_links.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsLinksRepository } from '@/domain/repositories/products_links.repository';
import { ProductsLinks } from '@/infra/database/entities/products_links.entity';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
import { CreateProductLinkDTO } from './create_product_link.dto';

@Injectable()
export class CreateProductLinkCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsLinksRepository: ProductsLinksRepository,
  ) {}

  async execute({
    product_id,
    title,
    type,
    price,
  }: CreateProductLinkDTO): Promise<ProductsLinks> {
    const product = await this.productsRepository.findById(product_id);

    if (!product) throw new ClientException('Produto não encontrado');
    if (product.status === 'BLOCKED')
      throw new ClientException(
        'Sem permissão para executar essa ação, produto bloqueado!',
      );

    let short_id = generateShortId(8);
    let short_id_valid = false;

    while (!short_id_valid) {
      const product_link = await this.productsLinksRepository.findBy({
        short_id,
      });

      if (!product_link) short_id_valid = true;
      else short_id = generateShortId(8);
    }

    const product_link = new ProductLink({
      product_id,
      title,
      type,
      price,
      short_id,
      status: 'active',
    });

    await this.productsLinksRepository.create(product_link);

    return product_link.allProps;
  }
}
