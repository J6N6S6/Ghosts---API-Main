import { Injectable } from '@nestjs/common';
import { ListCategoriesCase } from '../useCases/list-categories/list-categories.case';

@Injectable()
export class CategoriesService {
  constructor(private readonly listCategoriesCase: ListCategoriesCase) {}

  async ListAllCategories() {
    const categories = await this.listCategoriesCase.execute();
    return categories;
  }
}
