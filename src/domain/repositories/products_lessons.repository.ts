import { ProductsLessons } from '@/infra/database/entities';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ProductLesson } from '../models/product_lesson.model';

export abstract class ProductsLessonsRepository {
  abstract findById(id: string): Promise<ProductsLessons>;
  abstract findBy(
    options: FindOneOptions<ProductsLessons>,
  ): Promise<ProductsLessons>;
  abstract findByProductId(productId: string): Promise<ProductsLessons[]>;
  abstract create(data: ProductLesson): Promise<ProductsLessons>;
  abstract update(data: ProductLesson): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(
    options: FindManyOptions<ProductsLessons>,
  ): Promise<ProductsLessons[]>;
}
