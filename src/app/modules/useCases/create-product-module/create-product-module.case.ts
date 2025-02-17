import { ProductModule } from '@/domain/models/product_module.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsModulesRepository } from '@/domain/repositories/products_modules.repository';
import { ProductsModules } from '@/infra/database/entities/products_modules.entity';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
import { CreateProductModulesDTO } from './create-product-module.dto';

@Injectable()
export class CreateProductModulesCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsModulesRepository: ProductsModulesRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute({
    product_id,
    show_title,
    owner_id,
    title,
    image,
  }: CreateProductModulesDTO): Promise<ProductsModules> {
    const product = await this.productsRepository.findById(product_id);

    if (!product) throw new ClientException('Produto não encontrado');
    if (product.owner_id !== owner_id)
      throw new ClientException(
        'Você não tem permissão para criar um módulo neste produto',
      );

    let moduleImage = null;

    if (image) {
      const uploadResult = await this.uploadService.uploadFile({
        buffer: image,
        filename: title,
        location: ['modules', 'images'],
      });
      moduleImage = uploadResult.url;
    }

    const lastModule = await this.productsModulesRepository.findBy({
      where: {
        product_id: product_id,
      },
      order: {
        position: 'DESC',
      },
      select: ['position'],
    });

    const modules = new ProductModule({
      product_id: product_id,
      show_title: show_title,
      title: title,
      image: moduleImage,
      position: lastModule ? lastModule.position + 1 : 1,
    });

    return await this.productsModulesRepository.create(modules);
  }
}
