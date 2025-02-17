import { ProductPixel } from '@/domain/models/product_pixel.model';
import { ProductsPixelRepository } from '@/domain/repositories/products_pixel.repository';
import { ProductsPixel } from '@/infra/database/entities/products_pixels.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class TypeormProductsPixelRepository implements ProductsPixelRepository {
  constructor(
    @InjectRepository(ProductsPixel)
    private readonly PixelsRepository: Repository<ProductsPixel>,
  ) {}

  findById(id: string): Promise<ProductsPixel> {
    return this.PixelsRepository.findOneBy({ id });
  }

  create(data: ProductPixel): Promise<ProductsPixel> {
    return this.PixelsRepository.save(data.allProps);
  }

  findBy(where: FindOptionsWhere<ProductsPixel>): Promise<ProductsPixel> {
    return this.PixelsRepository.findOneBy(where);
  }

  findAllActiveByProductId(product_id: string): Promise<ProductsPixel[]> {
    return this.PixelsRepository.findBy({
      product_id: product_id,
      active: true,
    });
  }

  findAllByProductId(product_id: string): Promise<ProductsPixel[]> {
    return this.PixelsRepository.findBy({
      product_id: product_id,
    });
  }

  async update(data: ProductPixel): Promise<void> {
    await this.PixelsRepository.update(data.id, data.allProps);
  }

  async deleteById(id: string): Promise<void> {
    await this.PixelsRepository.delete(id);
  }

  find(options: FindManyOptions<ProductsPixel>): Promise<ProductsPixel[]> {
    return this.PixelsRepository.find(options);
  }
}
