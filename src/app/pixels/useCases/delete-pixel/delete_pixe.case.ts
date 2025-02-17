import { ProductsPixelRepository } from '@/domain/repositories/products_pixel.repository';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class DeletePixelCase {
  constructor(private readonly pixelsRepository: ProductsPixelRepository) {}

  async execute(pixel_id: string) {
    const pixel = await this.pixelsRepository.findById(pixel_id);

    if (!pixel) throw new ClientException('O pixel não existe');

    await this.pixelsRepository.deleteById(pixel_id);
  }
}
