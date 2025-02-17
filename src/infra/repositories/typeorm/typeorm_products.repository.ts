import { Product } from '@/domain/models/product.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { Products } from '@/infra/database/entities/products.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  ILike,
  In,
  Repository,
} from 'typeorm';

@Injectable()
export class TypeormProductsRepository implements ProductsRepository {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  create(product: Product): Promise<Products> {
    return this.productsRepository.save(product.allProps);
  }

  async update(product: Product): Promise<void> {
    await this.productsRepository.update(product.id, product.allProps);
  }

  findByTitleAndOwnerId(owner_id: string, title: string): Promise<Products> {
    return this.productsRepository.findOne({
      where: {
        owner_id,
        title: ILike(`%${title}%`),
      },
      select: {
        id: true,
        image: true,
        title: true,
        description: true,
        currency: true,
        sale_disabled: true,

        price: true,
        owner: {
          name: true,
          email: true,
        },
      },
      relations: ['owner', 'preferences'],
    });
  }

  findOne(options: FindOneOptions<Products>): Promise<Products> {
    return this.productsRepository.findOne(options);
  }

  findByShortId(short_id: string): Promise<Products> {
    return this.productsRepository.findOne({
      where: {
        short_id,
      },
    });
  }

  findByOwnerId(
    owner_id: string,
    options?: FindManyOptions<Products>,
  ): Promise<Products[]> {
    return this.productsRepository.find({
      where: {
        owner_id,
      },
      ...options,
    });
  }

  findAll(options?: FindManyOptions<Products>): Promise<Products[]> {
    return this.productsRepository.find(options);
  }

  findAndCount(
    options?: FindManyOptions<Products>,
  ): Promise<[Products[], number]> {
    return this.productsRepository.findAndCount(options);
  }

  count(options?: FindManyOptions<Products>): Promise<number> {
    return this.productsRepository.count(options);
  }

  findById(id: string): Promise<Products> {
    return this.productsRepository.findOne({
      where: {
        id,
      },
    });
  }

  findByIds(id: string[]): Promise<Products[]> {
    return this.productsRepository.find({
      where: {
        id: In(id),
      },
    });
  }

  async removeById(id: string): Promise<void> {
    await this.productsRepository.delete({
      id,
    });
  }
}
