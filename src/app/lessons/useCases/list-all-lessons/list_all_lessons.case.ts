import { ProductsLessonsRepository } from '@/domain/repositories';
import { ProductsLessons } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListAllLessonsCase {
  constructor(
    private readonly productsLessonsRepository: ProductsLessonsRepository,
  ) {}

  async execute(data: {
    owner_id: string;
    product_id: string;
  }): Promise<ProductsLessons[]> {
    const lessons = await this.productsLessonsRepository.findAll({
      where: {
        product: {
          id: data.product_id,
          owner_id: data.owner_id,
        },
      },
      order: {
        position: 'ASC',
      },
    });

    return lessons;
  }
}
