import { ProductPixel } from '@/domain/models/product_pixel.model';
import { ProductsPixelRepository } from '@/domain/repositories/products_pixel.repository';
import { Injectable } from '@nestjs/common';
import { UpdatePixelDTO } from '../../dtos/UpdatePixelDTO';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class UpdatePixelCase {
  constructor(private readonly pixelsRepository: ProductsPixelRepository) {}

  async execute({
    pixel_id,
    content,
    domain,
    purchase_event_bank_slip,
    purchase_event_pix,
  }: UpdatePixelDTO) {
    const pixel = await this.pixelsRepository.findById(pixel_id);

    if (!pixel) throw new ClientException('O pixel não existe');

    const pixelModel = new ProductPixel(pixel);

    if (content) pixelModel.content = content;
    if (domain) pixelModel.domain = domain;
    if (typeof purchase_event_bank_slip === 'boolean')
      pixelModel.purchase_event_bank_slip = purchase_event_bank_slip;
    if (typeof purchase_event_pix === 'boolean')
      pixelModel.purchase_event_pix = purchase_event_pix;

    await this.pixelsRepository.update(pixelModel);
  }
}
