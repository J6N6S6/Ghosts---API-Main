import { ProductAffiliate } from '@/domain/models/product_affiliate.model';
import { ProductsAffiliatesRepository } from '@/domain/repositories';
import { ProductsAffiliates } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormProductsAffiliatesRepository
  implements ProductsAffiliatesRepository
{
  constructor(
    @InjectRepository(ProductsAffiliates)
    private readonly productsAffiliatesRepository: Repository<ProductsAffiliates>,
  ) {}

  create(data: ProductAffiliate): Promise<ProductsAffiliates> {
    return this.productsAffiliatesRepository.save(data.allProps);
  }

  async update(data: ProductAffiliate): Promise<void> {
    await this.productsAffiliatesRepository.update(data.id, data.allProps);
  }

  findById(id: string): Promise<ProductsAffiliates> {
    return this.productsAffiliatesRepository.findOneBy({ id });
  }

  findOne(
    options: FindOneOptions<ProductsAffiliates>,
  ): Promise<ProductsAffiliates> {
    return this.productsAffiliatesRepository.findOne(options);
  }

  find(
    options: FindManyOptions<ProductsAffiliates>,
  ): Promise<ProductsAffiliates[]> {
    return this.productsAffiliatesRepository.find(options);
  }

  count(options: FindManyOptions<ProductsAffiliates>): Promise<number> {
    return this.productsAffiliatesRepository.count(options);
  }
}
