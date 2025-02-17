import { ProductMaterial } from '@/domain/models/product_material.model';
import { ProductsMaterialsRepository } from '@/domain/repositories';
import { ProductsMaterials } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormProductsMaterialsRepository
  implements ProductsMaterialsRepository
{
  constructor(
    @InjectRepository(ProductsMaterials)
    private readonly productsMaterialsRepository: Repository<ProductsMaterials>,
  ) {}

  findById(id: string): Promise<ProductsMaterials> {
    return this.productsMaterialsRepository.findOneBy({ id });
  }

  create(data: ProductMaterial): Promise<ProductsMaterials> {
    return this.productsMaterialsRepository.save(data.allProps);
  }

  findBy(
    options: FindOneOptions<ProductsMaterials>,
  ): Promise<ProductsMaterials> {
    return this.productsMaterialsRepository.findOne(options);
  }

  findAll(
    options: FindManyOptions<ProductsMaterials>,
  ): Promise<ProductsMaterials[]> {
    return this.productsMaterialsRepository.find(options);
  }

  async update(data: ProductMaterial): Promise<void> {
    await this.productsMaterialsRepository.update(data.id, data.allProps);
  }

  async delete(id: string): Promise<void> {
    await this.productsMaterialsRepository.delete(id);
  }
}
