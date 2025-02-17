import { ClientException } from '@/infra/exception/client.exception';
import { ProductLink } from '@/domain/models/products_links.model';
import { ProductsLinksRepository } from '@/domain/repositories/products_links.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChangeProductLinkCase {
  constructor(
    private readonly productsLinksRepository: ProductsLinksRepository,
  ) {}

  async execute(link_id: string): Promise<void> {
    const link = await this.productsLinksRepository.findById(link_id);

    if (!link) {
      throw new ClientException('Link não encontrado');
    }

    const linkModel = new ProductLink(link);

    linkModel.status = linkModel.status === 'active' ? 'inactive' : 'active';

    await this.productsLinksRepository.update(linkModel);
  }
}
