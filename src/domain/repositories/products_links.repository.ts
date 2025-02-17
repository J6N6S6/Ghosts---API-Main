import { ProductLink } from '@/domain/models/products_links.model';
import { ProductsLinks } from '@/infra/database/entities/products_links.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';

export abstract class ProductsLinksRepository {
  abstract create(data: ProductLink): Promise<void>;
  abstract update(data: ProductLink): Promise<void>;
  abstract findById(id: string): Promise<ProductsLinks>;
  abstract findByIds(id: string[]): Promise<ProductsLinks[]>;
  abstract findByShortId(short_id: string): Promise<ProductsLinks>;
  abstract findOne(
    options: FindOneOptions<ProductsLinks>,
  ): Promise<ProductsLinks>;

  abstract findBy(
    where: FindOptionsWhere<ProductsLinks>,
  ): Promise<ProductsLinks>;

  abstract removeById(id: string): Promise<void>;
  abstract findAllByProductId(product_id: string): Promise<ProductsLinks[]>;
  abstract findAll(
    options: FindManyOptions<ProductsLinks>,
  ): Promise<ProductsLinks[]>;
}
