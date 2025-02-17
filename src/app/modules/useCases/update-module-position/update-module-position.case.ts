import { ProductModule } from '@/domain/models/product_module.model';
import { ProductsModulesRepository } from '@/domain/repositories/products_modules.repository';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
import { UpdateModulePositionDTO } from './update-module-position.dto';
import { ProductsRepository } from '@/domain/repositories';

@Injectable()
export class UpdateModulePositionCase {
  constructor(
    private readonly productsModulesRepository: ProductsModulesRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute({
    module_id,
    product_id,
    user_id,
    position,
  }: UpdateModulePositionDTO): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: product_id },
      select: ['owner_id'],
    });

    if (!product)
      throw new ClientException(
        'Produto não encontrado ou não pertence ao usuário',
      );

    if (product.owner_id !== user_id)
      throw new ClientException(
        'Você não tem permissão para editar este produto',
      );

    const modules = await this.productsModulesRepository.findAll({
      where: {
        product: {
          id: product_id,
        },
      },
      select: ['id', 'position'],
    });

    const module = modules.find((module) => module.id === module_id);

    if (!module) throw new ClientException('Módulo não encontrado');

    const moduleSchema = new ProductModule(module);

    moduleSchema.position = position;

    await this.productsModulesRepository.update(moduleSchema);

    const modulesToUpdate = modules.filter(
      (module) => module.position >= position && module.id !== module_id,
    );

    await Promise.all(
      modulesToUpdate.map(async (module) => {
        const moduleSchema = new ProductModule(module);

        moduleSchema.position = module.position + 1;

        return await this.productsModulesRepository.update(moduleSchema);
      }),
    );
  }
}
