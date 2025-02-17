import { ProductsRepository } from '@/domain/repositories/products.repository';
import { Injectable } from '@nestjs/common';
import { UpdateProductImageDTO } from './update_product_image.dto';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Product } from '@/domain/models/product.model';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class UpdateProductImageCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async execute({
    image,
    product_id,
    user_id,
  }: UpdateProductImageDTO): Promise<{
    image: string;
  }> {
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

    if (findProduct.image) {
      try {
        await this.fileUploadService.deleteFile(findProduct.image);
      } catch (err) {
        console.log(err);
      }
    }

    const uploadResult = await this.fileUploadService.uploadFile({
      buffer: image,
      filename: product.title,
      location: ['products', 'images'],
    });
    product.image = uploadResult.url;

    await this.productsRepository.update(product);

    return {
      image: uploadResult.url,
    };
  }
}
