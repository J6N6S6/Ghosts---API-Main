import { ClientException } from '@/infra/exception/client.exception';
import { ProductsLinksRepository } from '@/domain/repositories/products_links.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteProductLinkCase {
  constructor(
    private readonly productsLinksRepository: ProductsLinksRepository,
  ) {}

  async execute(link_id: string): Promise<void> {
    const link = await this.productsLinksRepository.findOne({
      where: { id: link_id },
      select: {
        id: true,
        product: {
          status: true,
        },
      },
      relations: ['product'],
    });

    if (!link) {
      throw new ClientException('Link não encontrado');
    }

    if (link.product.status === 'BLOCKED')
      throw new ClientException(
        'Sem permissão para executar essa ação, produto bloqueado!',
      );

    await this.productsLinksRepository.removeById(link_id);
  }
}
