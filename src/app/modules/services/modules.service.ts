import { ProductsModules } from '@/infra/database/entities/products_modules.entity';
import { Injectable } from '@nestjs/common';
import { CreateProductModulesCase } from '../useCases/create-product-module/create-product-module.case';
import { CreateProductModulesDTO } from '../useCases/create-product-module/create-product-module.dto';
import { DeleteProductModulesCase } from '../useCases/delete-product-module/delete-product-module.case';
import { DeleteModuleDTO } from '../useCases/delete-product-module/delete-product-module.dto';
import { EditProductModulesCase } from '../useCases/edit-product-module/edit-product-module.case';
import { EditProductModuleDTO } from '../useCases/edit-product-module/edit-product-module.dto';
import { ListProductModulesCase } from '../useCases/list-product-modules/list-product-modules.case';
import { UpdateAllModulesPositionCase } from '../useCases/update-all-modules-position/update-all-modules-position.case';
import { UpdateAllModulesPositionDTO } from '../useCases/update-all-modules-position/update-all-modules-position.dto';
import { UpdateModulePositionCase } from '../useCases/update-module-position/update-module-position.case';
import { UpdateModulePositionDTO } from '../useCases/update-module-position/update-module-position.dto';
@Injectable()
export class ModulesService {
  constructor(
    private readonly createProductModulesCase: CreateProductModulesCase,
    private readonly editProductModulesCase: EditProductModulesCase,
    private readonly listProductModulesCase: ListProductModulesCase,
    private readonly deleteProductModulesCase: DeleteProductModulesCase,
    private readonly updateModulePositionCase: UpdateModulePositionCase,
    private readonly updateAllModulesPositionCase: UpdateAllModulesPositionCase,
  ) {}

  async ListProductModules(productId: string): Promise<ProductsModules[]> {
    return await this.listProductModulesCase.execute(productId);
  }

  async create(data: CreateProductModulesDTO) {
    return await this.createProductModulesCase.execute(data);
  }

  async edit(data: EditProductModuleDTO) {
    return await this.editProductModulesCase.execute(data);
  }

  async updateModulePosition(data: UpdateModulePositionDTO): Promise<any> {
    return await this.updateModulePositionCase.execute(data);
  }

  async updateAllModulesPosition(
    data: UpdateAllModulesPositionDTO,
  ): Promise<any> {
    return await this.updateAllModulesPositionCase.execute(data);
  }

  async deleteProductModule(data: DeleteModuleDTO) {
    return await this.deleteProductModulesCase.execute(data);
  }
}
