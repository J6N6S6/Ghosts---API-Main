import { Module } from '@nestjs/common';
import { InfraModule } from '@/infra/infra.module';
import { PackagesController } from './controllers/packages.controller';
import { ListPackagesByIdCase } from './useCases/list-packages-by-id/list-packages-by-id.case';
import { CreatePackageCase } from './useCases/create-package/create_package.case';
import { UpdatePackageCase } from './useCases/update-package/update_package.case';
import { UpdatePackageCustomizationCase } from './useCases/update-package-customization/update_package_customization.case';
import { UpdatePackageImageCase } from './useCases/update-package-image/update_package_image.case';
import { UpdatePackageBannerCase } from './useCases/update-package-banner/update_package_banner.case';
import { UpdatePackageLogoCase } from './useCases/update-package-logo/update_package_logo.case';
import { PackagesService } from './services/packages.service';
import { ListUserPackagesCase } from './useCases/list-user-packages/list_user_packages.case';
import { UserPackagesController } from './controllers/user_packages.controller';
@Module({
  imports: [InfraModule],
  providers: [
    PackagesService,
    ListUserPackagesCase,
    ListPackagesByIdCase,
    CreatePackageCase,
    UpdatePackageCase,
    UpdatePackageCustomizationCase,
    UpdatePackageImageCase,
    UpdatePackageBannerCase,
    UpdatePackageLogoCase,
  ],
  controllers: [PackagesController, UserPackagesController],
  exports: [PackagesService],
})
export class PackagesModule {}
