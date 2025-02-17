import { ProductModule } from '@/domain/models/product_module.model';
import { ProductsModules } from '@/infra/database/entities/products_modules.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class ProductsModulesRepository {
  abstract findById(id: string): Promise<ProductsModules>;
  abstract findBy(
    options: FindOneOptions<ProductsModules>,
  ): Promise<ProductsModules>;
  abstract findByProductId(productId: string): Promise<ProductsModules[]>;
  abstract create(data: ProductModule): Promise<ProductsModules>;
  abstract update(data: ProductModule): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(
    options: FindManyOptions<ProductsModules>,
  ): Promise<ProductsModules[]>;
}
