import { ProductsModulesRepository } from '@/domain/repositories/products_modules.repository';
import { ProductsModules } from '@/infra/database/entities/products_modules.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListProductModulesCase {
  constructor(
    private readonly productsModulesRepository: ProductsModulesRepository,
  ) {}

  async execute(productId: string): Promise<ProductsModules[]> {
    return this.productsModulesRepository.findAll({
      where: {
        product_id: productId,
      },
      order: {
        position: 'ASC',
      },
    });
  }
}
