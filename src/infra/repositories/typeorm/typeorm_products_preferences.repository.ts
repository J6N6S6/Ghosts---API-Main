import { ProductPreferences } from '@/domain/models/product_preferences.model';
import { ProductsPreferencesRepository } from '@/domain/repositories/products_preferences.repository';
import { ProductsPreferences } from '@/infra/database/entities/products_preferences.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeormProductsPreferencesRepository
  implements ProductsPreferencesRepository
{
  constructor(
    @InjectRepository(ProductsPreferences)
    private readonly productsPreferencesRepository: Repository<ProductsPreferences>,
  ) {}

  create(product: ProductPreferences): Promise<ProductsPreferences> {
    return this.productsPreferencesRepository.save(product.allProps);
  }

  async update(product: ProductPreferences): Promise<any> {
    return await this.productsPreferencesRepository.update(
      product.id,
      product.allProps,
    );
  }

  findByProductId(product_id: string): Promise<ProductsPreferences> {
    return this.productsPreferencesRepository.findOneBy({ product_id });
  }
}
