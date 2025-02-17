import { ProductsMaterials } from '@/infra/database/entities';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ProductMaterial } from '../models/product_material.model';

export abstract class ProductsMaterialsRepository {
  abstract findById(id: string): Promise<ProductsMaterials>;
  abstract findBy(
    options: FindOneOptions<ProductsMaterials>,
  ): Promise<ProductsMaterials>;
  abstract create(data: ProductMaterial): Promise<ProductsMaterials>;
  abstract update(data: ProductMaterial): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(
    options: FindManyOptions<ProductsMaterials>,
  ): Promise<ProductsMaterials[]>;
}
