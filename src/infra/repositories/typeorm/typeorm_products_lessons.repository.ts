import { ProductLesson } from '@/domain/models/product_lesson.model';
import { ProductsLessonsRepository } from '@/domain/repositories';
import { ProductsLessons } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormProductsLessonsRepository
  implements ProductsLessonsRepository
{
  constructor(
    @InjectRepository(ProductsLessons)
    private readonly productsLessonsRepository: Repository<ProductsLessons>,
  ) {}

  findById(id: string): Promise<ProductsLessons> {
    return this.productsLessonsRepository.findOneBy({ id });
  }

  create(data: ProductLesson): Promise<ProductsLessons> {
    return this.productsLessonsRepository.save(data.allProps);
  }

  findBy(options: FindOneOptions<ProductsLessons>): Promise<ProductsLessons> {
    return this.productsLessonsRepository.findOne(options);
  }

  findAll(
    options: FindManyOptions<ProductsLessons>,
  ): Promise<ProductsLessons[]> {
    return this.productsLessonsRepository.find(options);
  }

  findByProductId(product_id: string): Promise<ProductsLessons[]> {
    return this.productsLessonsRepository.find({
      where: { product_id },
      order: {
        position: 'ASC',
      },
    });
  }

  async update(data: ProductLesson): Promise<void> {
    await this.productsLessonsRepository.update(data.id, data.allProps);
  }

  async delete(id: string): Promise<void> {
    await this.productsLessonsRepository.delete(id);
  }
}
