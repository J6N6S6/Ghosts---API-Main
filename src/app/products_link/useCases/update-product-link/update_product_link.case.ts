import { ProductLink } from '@/domain/models/products_links.model';
import { ProductsLinksRepository } from '@/domain/repositories/products_links.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { UpdateProductLinkDTO } from './update_product_link.dto';

@Injectable()
export class UpdateProductLinkCase {
  constructor(
    private readonly productsLinksRepository: ProductsLinksRepository,
  ) {}

  async execute({
    link_id,
    title,
    price,
  }: UpdateProductLinkDTO): Promise<void> {
    const link = await this.productsLinksRepository.findOne({
      where: { id: link_id },
      select: {
        price: true,
        createdAt: true,
        id: true,
        product_id: true,
        short_id: true,
        status: true,
        title: true,
        type: true,
        updatedAt: true,
      },
      relations: ['product'],
    });

    if (!link) throw new ClientException('Produto não encontrado');

    if (link.product.status === 'BLOCKED')
      throw new ClientException(
        'Sem permissão para executar essa ação, produto bloqueado!',
      );

    const product_link = new ProductLink(link);

    if (title) product_link.title = title;
    if (price) product_link.price = price;

    await this.productsLinksRepository.update(product_link);
  }
}
