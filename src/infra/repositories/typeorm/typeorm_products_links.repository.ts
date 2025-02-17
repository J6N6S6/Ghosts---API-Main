import { ProductLink } from '@/domain/models/products_links.model';
import { ProductsLinksRepository } from '@/domain/repositories/products_links.repository';
import { ProductsLinks } from '@/infra/database/entities/products_links.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';

@Injectable()
export class TypeormProductsLinksRepository implements ProductsLinksRepository {
  constructor(
    @InjectRepository(ProductsLinks)
    private readonly productsLinksRepository: Repository<ProductsLinks>,
  ) {}

  async create(data: ProductLink): Promise<void> {
    await this.productsLinksRepository.save(data.allProps);
  }

  async update(data: ProductLink): Promise<void> {
    await this.productsLinksRepository.update(data.id, data.allProps);
  }

  findById(id: string): Promise<ProductsLinks> {
    return this.productsLinksRepository.findOneBy({
      id,
    });
  }

  findByIds(id: string[]): Promise<ProductsLinks[]> {
    return this.productsLinksRepository.find({
      where: {
        id: In(id),
      },
    });
  }

  findByShortId(short_id: string): Promise<ProductsLinks> {
    return this.productsLinksRepository.findOneBy({
      short_id,
    });
  }

  findOne(options: FindOneOptions<ProductsLinks>): Promise<ProductsLinks> {
    return this.productsLinksRepository.findOne(options);
  }

  findBy(where: FindOptionsWhere<ProductsLinks>): Promise<ProductsLinks> {
    return this.productsLinksRepository.findOneBy(where);
  }

  async removeById(id: string): Promise<void> {
    await this.productsLinksRepository.delete({ id });
  }

  findAllByProductId(product_id: string): Promise<ProductsLinks[]> {
    return this.productsLinksRepository.findBy({
      product_id,
    });
  }

  findAll(options: FindManyOptions<ProductsLinks>): Promise<ProductsLinks[]> {
    return this.productsLinksRepository.find(options);
  }
}
