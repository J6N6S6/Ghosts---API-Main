import { ProductsAffiliates } from '@/infra/database/entities';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ProductAffiliate } from '../models/product_affiliate.model';

export abstract class ProductsAffiliatesRepository {
  abstract create(data: ProductAffiliate): Promise<ProductsAffiliates>;
  abstract update(data: ProductAffiliate): Promise<void>;
  abstract findById(id: string): Promise<ProductsAffiliates>;
  abstract findOne(
    options: FindOneOptions<ProductsAffiliates>,
  ): Promise<ProductsAffiliates>;
  abstract find(
    options: FindManyOptions<ProductsAffiliates>,
  ): Promise<ProductsAffiliates[]>;
  abstract count(options: FindManyOptions<ProductsAffiliates>): Promise<number>;
}
