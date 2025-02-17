import { ProductPixel } from '@/domain/models/product_pixel.model';
import { ProductsPixelRepository } from '@/domain/repositories/products_pixel.repository';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class ChangePixelVisibilityCase {
  constructor(private readonly pixelsRepository: ProductsPixelRepository) {}

  async execute(pixel_id: string) {
    const pixel = await this.pixelsRepository.findById(pixel_id);

    if (!pixel) throw new ClientException('O pixel não existe');

    const pixelModel = new ProductPixel(pixel);

    pixelModel.active = !pixelModel.active;

    await this.pixelsRepository.update(pixelModel);
  }
}
