import { Injectable } from '@nestjs/common';
import { ListPackagesByIdCase } from '../useCases/list-packages-by-id/list-packages-by-id.case';
import { CreatePackageCase } from '../useCases/create-package/create_package.case';
import { UpdatePackageCase } from '../useCases/update-package/update_package.case';
import { UpdatePackageCustomizationCase } from '../useCases/update-package-customization/update_package_customization.case';
import { CreatePackageDTO } from '../dtos/CreatePackageDTO';
import { Packages } from '@/infra/database/entities/packages.entity';
import { ListUserPackagesCase } from '../useCases/list-user-packages/list_user_packages.case';
import { UpdatePackageImageCase } from '../useCases/update-package-image/update_package_image.case';
import { UpdatePackageBannerCase } from '../useCases/update-package-banner/update_package_banner.case';
import { UpdatePackageLogoCase } from '../useCases/update-package-logo/update_package_logo.case';
import { UpdatePackageDTO } from '../dtos/UpdatePackageDTO';
import { UpdatePackageCustomizationDTO } from '../dtos/UpdatePackageCustomizationDTO';
@Injectable()
export class PackagesService {
  constructor(
    private readonly listUserPackagesCase: ListUserPackagesCase,
    private readonly listPackagesByIdCase: ListPackagesByIdCase,
    private readonly createPackageCase: CreatePackageCase,
    private readonly updatePackageCase: UpdatePackageCase,
    private readonly updatePackageCustomizationCase: UpdatePackageCustomizationCase,
    private readonly updatePackageImageCase: UpdatePackageImageCase,
    private readonly updatePackageBannerCase: UpdatePackageBannerCase,
    private readonly updatePackageLogoCase: UpdatePackageLogoCase,
  ) {}

  async listUserPackages(ownerId: string): Promise<Packages[]> {
    return this.listUserPackagesCase.execute(ownerId);
  }

  async ListPackagesById(packageId: string): Promise<Packages> {
    return this.listPackagesByIdCase.execute(packageId);
  }

  async createPackage(data: CreatePackageDTO) {
    const modules = await this.createPackageCase.execute(data);
    return {
      hasError: false,
      data: modules,
    };
  }

  async updatePackage(data: UpdatePackageDTO): Promise<any> {
    return await this.updatePackageCase.execute(data);
  }

  async updatePackageCustomization({
    package_id,
    contact,
    favicon,
    background_color,
    color_header,
    user_id,
  }: UpdatePackageCustomizationDTO): Promise<any> {
    return this.updatePackageCustomizationCase.execute({
      contact,
      favicon,
      background_color,
      color_header,
      package_id,
      user_id,
    });
  }

  async updatePackageImage({
    packageId,
    image,
    user_id,
  }: {
    packageId: string;
    image: Buffer;
    user_id: string;
  }): Promise<{ image: string }> {
    return this.updatePackageImageCase.execute(image, packageId, user_id);
  }

  async updatePackageBanner({
    packageId,
    banner,
    user_id,
  }: {
    packageId: string;
    banner: Buffer;
    user_id: string;
  }): Promise<{ banner: string }> {
    return this.updatePackageBannerCase.execute(banner, packageId, user_id);
  }

  async updatePackageLogo({
    packageId,
    logo,
    user_id,
  }: {
    packageId: string;
    logo: Buffer;
    user_id: string;
  }): Promise<{ logo: string }> {
    return this.updatePackageLogoCase.execute(logo, packageId, user_id);
  }
}
