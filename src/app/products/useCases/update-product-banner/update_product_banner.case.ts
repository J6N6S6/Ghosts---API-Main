import { Product } from '@/domain/models/product.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
import { UpdateProductBannerDTO } from './update_product_banner.dto';

@Injectable()
export class UpdateProductBannerCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async execute({
    banner,
    banner_type,
    product_id,
    user_id,
  }: UpdateProductBannerDTO): Promise<any> {
    const findProduct = await this.productsRepository.findById(product_id);

    if (!findProduct) {
      throw new ClientException('Produto não encontrado');
    }

    const product = new Product(findProduct);

    if (product.owner_id !== user_id) {
      throw new ClientException('Você só pode alterar os seus produtos!');
    }

    if (product.status === 'BLOCKED')
      throw new ClientException(
        'Sem permissão para executar essa ação, produto bloqueado!',
      );

    const hasBanner =
      banner_type === 'primary'
        ? findProduct.primary_banner
        : findProduct.secondary_banner;

    if (hasBanner) {
      try {
        await this.fileUploadService.deleteFile(hasBanner);
      } catch (err) {
        console.log(err);
      }
    }

    if (banner) {
      const uploadResult = await this.fileUploadService.uploadFile({
        buffer: banner,
        filename: product.title,
        location: ['products', 'banners'],
      });

      if (banner_type === 'primary') product.primary_banner = uploadResult.url;
      else product.secondary_banner = uploadResult.url;
    } else {
      if (banner_type === 'primary') product.primary_banner = null;
      else product.secondary_banner = null;
    }

    await this.productsRepository.update(product);

    return {
      banner:
        banner_type === 'primary'
          ? product.primary_banner
          : product.secondary_banner,
    };
  }
}
