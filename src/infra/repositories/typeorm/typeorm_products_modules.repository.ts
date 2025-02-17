import { ProductModule } from '@/domain/models/product_module.model';
import { ProductsModulesRepository } from '@/domain/repositories/products_modules.repository';
import { ProductsModules } from '@/infra/database/entities/products_modules.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormProductsModulesRepository
  implements ProductsModulesRepository
{
  constructor(
    @InjectRepository(ProductsModules)
    private readonly productsModulesRepository: Repository<ProductsModules>,
  ) {}

  findById(id: string): Promise<ProductsModules> {
    return this.productsModulesRepository.findOneBy({ id });
  }

  create(data: ProductModule): Promise<ProductsModules> {
    return this.productsModulesRepository.save(data.allProps);
  }

  findBy(options: FindOneOptions<ProductsModules>): Promise<ProductsModules> {
    return this.productsModulesRepository.findOne(options);
  }

  findAll(
    options: FindManyOptions<ProductsModules>,
  ): Promise<ProductsModules[]> {
    return this.productsModulesRepository.find(options);
  }

  findByProductId(product_id: string): Promise<ProductsModules[]> {
    return this.productsModulesRepository.find({
      where: { product_id },
      order: {
        position: 'ASC',
      },
    });
  }

  async update(data: ProductModule): Promise<void> {
    await this.productsModulesRepository.update(data.id, data.allProps);
  }

  async delete(id: string): Promise<void> {
    await this.productsModulesRepository.delete(id);
  }
}
