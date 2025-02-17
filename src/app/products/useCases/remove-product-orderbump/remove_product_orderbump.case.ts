import { ProductPreferences } from '@/domain/models/product_preferences.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsPreferencesRepository } from '@/domain/repositories/products_preferences.repository';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
import { RemoveProductOrderbumpDTO } from './remove_product_orderbump.dto';

@Injectable()
export class RemoveProductOrderbumpCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsPreferencesRepository: ProductsPreferencesRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute({
    product_id,
    bump_id,
  }: RemoveProductOrderbumpDTO): Promise<void> {
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
      throw new ClientException('Não há orderbumps para remover');
    }

    const findProduct = preferencesModel.orderbumps.find(
      (orderbump) => orderbump.bump_id === bump_id,
    );

    if (!findProduct) {
      throw new ClientException('Orderbump não encontrado');
    }

    if (findProduct.image) {
      try {
        await this.uploadService.deleteFile(findProduct.image);
      } catch (err) {
        console.log(err);
      }
    }

    preferencesModel.orderbumps = preferencesModel.orderbumps.filter(
      (orderbump) => orderbump.bump_id !== bump_id,
    );

    await this.productsPreferencesRepository.update(preferencesModel);
  }
}
