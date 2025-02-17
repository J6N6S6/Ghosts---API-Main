import { ProductPixel } from '@/domain/models/product_pixel.model';
import { ProductsPixel } from '@/infra/database/entities/products_pixels.entity';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

export abstract class ProductsPixelRepository {
  abstract create(data: ProductPixel): Promise<ProductsPixel>;
  abstract update(data: ProductPixel): Promise<void>;
  abstract findById(id: string): Promise<ProductsPixel>;
  abstract findBy(
    where: FindOptionsWhere<ProductsPixel>,
  ): Promise<ProductsPixel>;
  abstract findAllActiveByProductId(
    product_id: string,
  ): Promise<ProductsPixel[]>;
  abstract findAllByProductId(product_id: string): Promise<ProductsPixel[]>;
  abstract deleteById(id: string): Promise<void>;
  abstract find(
    options: FindManyOptions<ProductsPixel>,
  ): Promise<ProductsPixel[]>;
}
