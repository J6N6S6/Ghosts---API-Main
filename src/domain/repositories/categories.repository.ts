import { Category } from '@/domain/models/categories.model';
import { Categories } from '@/infra/database/entities/categories.entity';
import { FindOptionsWhere } from 'typeorm';

export abstract class CategoriesRepository {
  abstract create(category: Category): Promise<void>;
  abstract findById(id: string): Promise<Categories>;
  abstract findBy(where: FindOptionsWhere<Categories>): Promise<Categories>;
  abstract findAll(): Promise<Categories[]>;
  abstract createMany(categories: Category[]): Promise<void>;
}
