import { ProductContentModel } from '@/domain/models/product_content.model';
import { ProductMaterial } from '@/domain/models/product_material.model';
import { IEProductsContentRepository } from '@/domain/repositories/products_content.repository';
import { ProductsContentEntity } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormProductsContentRepository
  implements IEProductsContentRepository
{
  constructor(
    @InjectRepository(ProductsContentEntity)
    private readonly productsContentsRepository: Repository<ProductsContentEntity>,
  ) {}

  findById(id: string): Promise<ProductsContentEntity> {
    return this.productsContentsRepository.findOneBy({ id });
  }

  create(data: ProductMaterial): Promise<ProductsContentEntity> {
    return this.productsContentsRepository.save(data.allProps);
  }

  findBy(
    options: FindOneOptions<ProductsContentEntity>,
  ): Promise<ProductsContentEntity> {
    return this.productsContentsRepository.findOne(options);
  }

  findAll(
    options: FindManyOptions<ProductsContentEntity>,
  ): Promise<ProductsContentEntity[]> {
    return this.productsContentsRepository.find(options);
  }

  async update(data: ProductContentModel): Promise<void> {
    await this.productsContentsRepository.update(data.id, data.allProps);
  }

  async delete(id: string): Promise<void> {
    await this.productsContentsRepository.delete(id);
  }
}
