import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/list')
  async ListAllCategories() {
    const categories = await this.categoriesService.ListAllCategories();

    return {
      hasError: false,
      data: categories,
    };
  }
}
