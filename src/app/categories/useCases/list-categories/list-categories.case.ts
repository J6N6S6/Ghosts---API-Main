import { CategoriesRepository } from '@/domain/repositories/categories.repository';
import { Categories } from '@/infra/database/entities/categories.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListCategoriesCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute(): Promise<Categories[]> {
    return this.categoriesRepository.findAll();
  }
}
