import { Product } from '@/domain/models/product.model';
import { Section } from '@/domain/models/sections.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { SectionsRepository } from '@/domain/repositories/sections.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';
import { CreateSectionDTO } from '../../dtos/CreateSectionDTO';
@Injectable()
export class CreateSectionCase {
  constructor(
    private readonly sectionsRepository: SectionsRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute({
    title,
    products,
    package_id,
    user_id,
  }: CreateSectionDTO): Promise<any> {
    try {
      const sections = new Section({
        title: title,
        package_id: package_id,
      });

      await this.sectionsRepository.create(sections);

      Promise.all([
        products.forEach(async (product) => {
          const findProduct = await this.productsRepository.findById(product);
          if (!findProduct) return;
          if (findProduct.owner_id !== user_id) return;

          const p = new Product(findProduct);
          p.package_id = package_id;
          p.section_id = sections.id;

          await this.productsRepository.update(p);
        }),
      ]);
    } catch (err) {
      if (err instanceof ClientException) throw err;
      throw new ServerException('Erro interno ao criar a seção!', {
        title,
        products,
        package_id,
        user_id,
      });
    }
  }
}
