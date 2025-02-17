import { Injectable } from '@nestjs/common';
import { SectionsRepository } from '@/domain/repositories/sections.repository';
import { Section } from '@/domain/models/sections.model';
import { UpdateSectionDTO } from '../../dtos/UpdateSectionDTO';
import { PackagesRepository } from '@/domain/repositories/packages.repository';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { Product } from '@/domain/models/product.model';
import { ClientException } from '@/infra/exception/client.exception';
@Injectable()
export class UpdateSectionCase {
  constructor(
    private readonly sectionsRepository: SectionsRepository,
    private readonly packagesRepository: PackagesRepository,
    private readonly productsRespository: ProductsRepository,
  ) {}

  async execute(data: UpdateSectionDTO): Promise<any> {
    try {
      const section = await this.sectionsRepository.findById(data.sectionId);

      if (!section) throw new ClientException('Seção não encontrado');

      const packageQuery = await this.packagesRepository.findById(
        section.package_id,
      );

      if (packageQuery.owner_id !== data.user_id)
        throw new ClientException(
          'Você não tem permissão para editar essa seção',
        );

      const sections = new Section(section);
      if (data.title) sections.title = data.title;

      await this.sectionsRepository.update(sections);

      const products = await this.productsRespository.findAll({
        where: { section_id: section.id },
      });

      await Promise.all([
        products.forEach(async (product) => {
          const p = new Product(product);
          p.section_id = null;
          await this.productsRespository.update(p);
        }),
      ]);

      await Promise.all([
        data.products.forEach(async (product) => {
          const findProduct = await this.productsRespository.findById(product);
          if (!findProduct) return;
          if (findProduct.owner_id !== data.user_id) return;

          const p = new Product(findProduct);
          p.package_id = section.package_id;
          p.section_id = sections.id;

          await this.productsRespository.update(p);
        }),
      ]);
    } catch (err) {
      if (err instanceof ClientException) throw err;
      throw new ClientException(
        'Erro interno ao fazer essa ação na seção!',
        err,
      );
    }
  }
}
