import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PackagesService } from '../services/packages.service';
import { CreatePackageBody } from '../validators/createPackage.body';

@Controller('/products/packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get('/:packageId')
  async ListPackagesById(@Param('packageId') packageId: string) {
    const packages = await this.packagesService.ListPackagesById(packageId);
    return {
      hasError: false,
      data: packages,
    };
  }

  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  async createPackage(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreatePackageBody,
    @CurrentUser('user_id') user_id: string,
  ) {
    return this.packagesService.createPackage({
      ...data,
      owner_id: user_id,
      image: file.buffer,
    });
  }

  @Put('/:packageId/update')
  async updatePackage(
    @Body() data: CreatePackageBody,
    @Param('packageId') packageId: string,
    @CurrentUser('user_id') user_id: string,
  ): Promise<any> {
    return this.packagesService.updatePackage({
      ...data,
      packageId,
      user_id,
    });
  }

  @Put('/:package_id/update/customization')
  @UseInterceptors(FileInterceptor('favicon'))
  async updatePackageCustomization(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: any,
    @Param('package_id') package_id: string,
    @CurrentUser('user_id') user_id: string,
  ): Promise<any> {
    try {
      return this.packagesService.updatePackageCustomization({
        contact: JSON.parse(data.contact),
        favicon: file ? file.buffer : null,
        background_color: JSON.parse(data.background_color),
        color_header: JSON.parse(data.color_header),
        package_id,
        user_id,
      });
    } catch (err) {
      console.log(err);
    }
  }

  @Patch('/:packageId/image')
  @UseInterceptors(FileInterceptor('image'))
  async updatePackageImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('packageId') packageId: string,
    @CurrentUser('user_id') user_id: string,
  ): Promise<any> {
    const data = await this.packagesService.updatePackageImage({
      image: file.buffer,
      packageId,
      user_id,
    });

    return {
      hasError: false,
      message: 'Pacote atualizado com sucesso!',
      data,
    };
  }

  @Patch('/:packageId/banner')
  @UseInterceptors(FileInterceptor('banner'))
  async updatePackageBanner(
    @UploadedFile() file: Express.Multer.File,
    @Param('packageId') packageId: string,
    @CurrentUser('user_id') user_id: string,
  ): Promise<any> {
    const data = this.packagesService.updatePackageBanner({
      banner: file.buffer,
      packageId,
      user_id,
    });
    return {
      hasError: false,
      message: 'Pacote atualizado com sucesso!',
      data,
    };
  }

  @Patch('/:packageId/logo')
  @UseInterceptors(FileInterceptor('logo'))
  async updatePackageLogo(
    @UploadedFile() file: Express.Multer.File,
    @Param('packageId') packageId: string,
    @CurrentUser('user_id') user_id: string,
  ): Promise<any> {
    const data = this.packagesService.updatePackageLogo({
      logo: file.buffer,
      packageId,
      user_id,
    });

    return {
      hasError: false,
      message: 'Pacote atualizado com sucesso!',
      data,
    };
  }
}
