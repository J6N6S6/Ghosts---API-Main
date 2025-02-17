import { ProductPreferences } from '@/domain/models/product_preferences.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsPreferencesRepository } from '@/domain/repositories/products_preferences.repository';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
import { AddProductOrderbumpDTO } from './add_product_orderbump.dto';
import { ProductsLinksRepository } from '@/domain/repositories/products_links.repository';

@Injectable()
export class AddProductOrderbumpCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsPreferencesRepository: ProductsPreferencesRepository,
    private readonly productsLinksRepository: ProductsLinksRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute({
    product_id,
    bump_id,
    image,
    product_link,
    aux_phrase,
    sell_phrase,
  }: AddProductOrderbumpDTO): Promise<void> {
    if (bump_id === product_id)
      throw new ClientException('O bump não pode ser o mesmo produto');

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

    const link_exists = await this.productsLinksRepository.findByShortId(
      product_link,
    );

    if (!link_exists) throw new ClientException('Esse link não existe');
    if (link_exists.product_id !== bump_id)
      throw new ClientException('Esse link não pertence a esse produto');

    const productPreferences =
      await this.productsPreferencesRepository.findByProductId(product_id);

    const preferencesModel = new ProductPreferences(
      productPreferences
        ? productPreferences
        : {
            product_id,
          },
    );

    if (preferencesModel.orderbumps.length >= 5) {
      throw new ClientException('Limite de 5 orderbumps atingido');
    }

    const isBumpAlreadyAdded = preferencesModel.orderbumps.find(
      (item) => item.bump_id === bump_id,
    );

    if (isBumpAlreadyAdded) {
      throw new ClientException('Esse Order Bump ja foi adicionado');
    }

    let uploadResult: null | string = null;

    if (image) {
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

    preferencesModel.orderbumps = [
      ...preferencesModel.orderbumps,
      {
        bump_id,
        image: uploadResult ?? null,
        product_link,
        aux_phrase,
        sell_phrase,
      },
    ];

    await this.productsPreferencesRepository.update(preferencesModel);
  }
}
