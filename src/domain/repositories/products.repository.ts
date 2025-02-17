import { Product } from '@/domain/models/product.model';
import { Products } from '@/infra/database/entities/products.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class ProductsRepository {
  abstract create(product: Product): Promise<Products>;
  abstract update(product: Product): Promise<void>;
  abstract findById(id: string): Promise<Products>;
  abstract findByIds(id: string[]): Promise<Products[]>;
  abstract findOne(options: FindOneOptions<Products>): Promise<Products>;
  abstract findByShortId(short_id: string): Promise<Products>;
  abstract findByTitleAndOwnerId(
    owner_id: string,
    title: string,
  ): Promise<Products>;
  abstract findByOwnerId(
    owner_id: string,
    options?: FindManyOptions<Products>,
  ): Promise<Products[]>;
  abstract findAll(options?: FindManyOptions<Products>): Promise<Products[]>;
  abstract findAndCount(
    options?: FindManyOptions<Products>,
  ): Promise<[Products[], number]>;
  abstract count(options?: FindManyOptions<Products>): Promise<number>;
}
