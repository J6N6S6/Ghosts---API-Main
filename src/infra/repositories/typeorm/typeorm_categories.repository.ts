import { Category } from '@/domain/models/categories.model';
import { CategoriesRepository } from '@/domain/repositories/categories.repository';
import { Categories } from '@/infra/database/entities/categories.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class TypeormCategoriesRepository implements CategoriesRepository {
  constructor(
    @InjectRepository(Categories)
    private readonly CategoriesRepository: Repository<Categories>,
  ) {}

  findById(id: string): Promise<Categories> {
    return this.CategoriesRepository.findOneBy({ id });
  }

  async create(data: Category): Promise<void> {
    await this.CategoriesRepository.save({
      id: data.id,
      image: data.image,
      title: data.title,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  findBy(where: FindOptionsWhere<Categories>): Promise<Categories> {
    return this.CategoriesRepository.findOneBy(where);
  }

  findAll(): Promise<Categories[]> {
    return this.CategoriesRepository.find();
  }

  async createMany(categories: Category[]): Promise<void> {
    await this.CategoriesRepository.save(categories);
  }
}
