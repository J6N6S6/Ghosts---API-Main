import { ProductPixel } from '@/domain/models/product_pixel.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsPixelRepository } from '@/domain/repositories/products_pixel.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { CreatePixelDTO } from '../../dtos/CreatePixelDTO';
import { ProductsAffiliatesRepository } from '@/domain/repositories';

@Injectable()
export class CreatePixelCase {
  constructor(
    private readonly pixelsRepository: ProductsPixelRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly productsAffiliatesRepository: ProductsAffiliatesRepository,
  ) {}

  async execute({
    product_id,
    content,
    domain,
    type,
    purchase_event_bank_slip,
    purchase_event_pix,
    title,
    token,
    user_id,
  }: CreatePixelDTO) {
    const product = await this.productsRepository.findById(product_id);

    if (!product) throw new ClientException('O produto não existe');

    if (product.owner_id !== user_id) {
      const userIsAffiliate = await this.productsAffiliatesRepository.findOne({
        where: {
          product_id,
          user_id,
          blocked: false,
          status: 'ACCEPTED',
        },
      });

      if (!userIsAffiliate)
        throw new ClientException('Você não é afiliado deste produto');
    }

    const pixelModel = new ProductPixel({
      product_id,
      content,
      domain,
      type,
      purchase_event_pix,
      purchase_event_bank_slip,
      title,
      token,
      user_id,
    });

    await this.pixelsRepository.create(pixelModel);
  }
}
