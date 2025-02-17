import { ProductModule } from '@/domain/models/product_module.model';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsModulesRepository } from '@/domain/repositories/products_modules.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { EditProductModuleDTO } from './edit-product-module.dto';

@Injectable()
export class EditProductModulesCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsModulesRepository: ProductsModulesRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute({
    module_id,
    show_title,
    owner_id,
    title,
    image,
  }: EditProductModuleDTO): Promise<void> {
    const module = await this.productsModulesRepository.findBy({
      where: {
        id: module_id,
        product: {
          owner_id: owner_id,
        },
      },
    });

    if (!module) throw new ClientException('Modulo não encontrado');

    const moduleSchema = new ProductModule(module);

    if (image) {
      if (module.image) {
        await this.uploadService.deleteFile(module.image);
      }

      const uploadResult = await this.uploadService.uploadFile({
        buffer: image,
        filename: title,
        location: ['modules', 'images'],
      });

      moduleSchema.image = uploadResult.url;
    }
    if (title) moduleSchema.title = title;
    if (show_title || show_title === null) moduleSchema.show_title = show_title;

    return await this.productsModulesRepository.update(moduleSchema);
  }
}
