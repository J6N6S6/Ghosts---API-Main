import { ProductsModulesRepository } from '@/domain/repositories/products_modules.repository';
import { Injectable } from '@nestjs/common';
import { DeleteModuleDTO } from './delete-product-module.dto';
import { ClientException } from '@/infra/exception/client.exception';
@Injectable()
export class DeleteProductModulesCase {
  constructor(
    private readonly productsModulesRepository: ProductsModulesRepository,
  ) {}

  async execute({ module_id, owner_id }: DeleteModuleDTO): Promise<void> {
    const module = await this.productsModulesRepository.findBy({
      where: {
        id: module_id,
        product: {
          owner_id: owner_id,
        },
      },
      relations: ['lessons'],
    });

    if (!module) {
      throw new ClientException('Módulo não encontrado');
    }

    if (module.lessons.length > 0) {
      throw new ClientException('Não é possível deletar um módulo com aulas');
    }

    await this.productsModulesRepository.delete(module_id);
  }
}
