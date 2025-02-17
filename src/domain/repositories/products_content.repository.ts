import { ProductsContentEntity } from '@/infra/database/entities';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class IEProductsContentRepository {
  abstract findById(id: string): Promise<ProductsContentEntity>;
  abstract findBy(
    options: FindOneOptions<ProductsContentEntity>,
  ): Promise<ProductsContentEntity>;
  abstract create(data: ProductsContentEntity): Promise<ProductsContentEntity>;
  abstract update(data: ProductsContentEntity): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(
    options: FindManyOptions<ProductsContentEntity>,
  ): Promise<ProductsContentEntity[]>;
}
