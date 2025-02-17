import { ProductPreferences } from '@/domain/models/product_preferences.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsPreferencesRepository } from '@/domain/repositories/products_preferences.repository';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
import { UpdateProductOrderbumpDTO } from './update_product_orderbump.dto';

@Injectable()
export class UpdateProductOrderbumpCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsPreferencesRepository: ProductsPreferencesRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute({
    product_id,
    bump_id,
    image,
    product_link,
    aux_phrase,
    sell_phrase,
  }: UpdateProductOrderbumpDTO): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: product_id },
      select: {
        id: true,
      },
    });

    if (!product) {
      throw new ClientException('Produto não encontrado');
    }

    if (product.status === 'BLOCKED')
      throw new ClientException(
        'Sem permissão para executar essa ação, produto bloqueado!',
      );

    const productPreferences =
      await this.productsPreferencesRepository.findByProductId(product_id);

    const preferencesModel = new ProductPreferences(
      productPreferences
        ? productPreferences
        : {
            product_id,
          },
    );

    if (preferencesModel.orderbumps.length === 0) {
      throw new ClientException('Não há orderbumps para atualizar');
    }

    const findProduct = preferencesModel.orderbumps.find(
      (orderbump) => orderbump.bump_id === bump_id,
    );

    if (!findProduct) {
      throw new ClientException('Orderbump não encontrado');
    }

    let uploadResult: null | string = null;

    if (image) {
      if (findProduct.image)
        await this.uploadService.deleteFile(findProduct.image);
      try {
        const result = await this.uploadService.uploadFile({
          buffer: image,
          location: ['products', 'orderbumps', 'images'],
        });

        uploadResult = result.url;
      } catch (err) {
        console.log(err);
      }
    }

    preferencesModel.orderbumps = preferencesModel.orderbumps.map(
      (orderbump) => {
        if (orderbump.bump_id === bump_id) {
          return {
            ...orderbump,
            image: uploadResult ?? orderbump.image,
            product_link: product_link ?? orderbump.product_link,
            aux_phrase: aux_phrase ?? orderbump.aux_phrase,
            sell_phrase: sell_phrase ?? orderbump.sell_phrase,
          };
        }
        return orderbump;
      },
    );

    await this.productsPreferencesRepository.update(preferencesModel);
  }
}
