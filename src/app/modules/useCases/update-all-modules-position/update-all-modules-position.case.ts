import { ProductModule } from '@/domain/models/product_module.model';
import { ProductsModulesRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { UpdateAllModulesPositionDTO } from './update-all-modules-position.dto';

@Injectable()
export class UpdateAllModulesPositionCase {
  constructor(
    private readonly productsModulesRepository: ProductsModulesRepository,
  ) {}

  async execute({
    owner_id,
    modules,
  }: UpdateAllModulesPositionDTO): Promise<void> {
    const ModulesToUpdate = await this.productsModulesRepository.findAll({
      where: {
        id: In(modules.map((module) => module.module_id)),
        product: {
          owner_id,
        },
      },
      order: {
        position: 'ASC',
      },
      select: ['id', 'position'],
    });

    await Promise.all(
      ModulesToUpdate.map(async (module) => {
        const moduleSchema = new ProductModule(module);

        moduleSchema.position = modules.find(
          (lessonToUpdate) => lessonToUpdate.module_id === module.id,
        ).position;

        return await this.productsModulesRepository.update(moduleSchema);
      }),
    );
  }
}
