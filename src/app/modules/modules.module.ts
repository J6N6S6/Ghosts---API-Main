import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { ModulesController } from './controllers/modules.controller';
import { ModulesService } from './services/modules.service';
import { CreateProductModulesCase } from './useCases/create-product-module/create-product-module.case';
import { DeleteProductModulesCase } from './useCases/delete-product-module/delete-product-module.case';
import { ListProductModulesCase } from './useCases/list-product-modules/list-product-modules.case';
import { UpdateModulePositionCase } from './useCases/update-module-position/update-module-position.case';
import { EditProductModulesCase } from './useCases/edit-product-module/edit-product-module.case';
import { UpdateAllModulesPositionCase } from './useCases/update-all-modules-position/update-all-modules-position.case';
import { UserSecureReserveModule } from './user-secure-reserve.module';
@Module({
  imports: [InfraModule, UserSecureReserveModule],
  providers: [
    ModulesService,
    ListProductModulesCase,
    CreateProductModulesCase,
    EditProductModulesCase,
    DeleteProductModulesCase,
    UpdateModulePositionCase,
    UpdateAllModulesPositionCase,
  ],
  controllers: [ModulesController],
  exports: [ModulesService],
})
export class ModulesModule {}
