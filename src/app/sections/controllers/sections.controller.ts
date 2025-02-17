import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SectionsService } from '../services/sections.service';
import { CreateSectionBody } from '../validators/createSection.body';
import { UpdateSectionBody } from '../validators/updateSection.body';
import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
@Controller('products/sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get('/list/:package_id')
  async ListPackageSections(@Param('package_id') package_id: string) {
    const modules = await this.sectionsService.ListPackageSections(package_id);
    return {
      hasError: false,
      data: modules,
    };
  }

  @Post('/:package_id/create')
  async CreateSection(
    @Body() data: CreateSectionBody,
    @Param('package_id') package_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    return this.sectionsService.CreateSection({
      ...data,
      package_id,
      user_id,
    });
  }

  @Put('/:sectionId/update')
  async UpdateSection(
    @Body() data: UpdateSectionBody,
    @Param('sectionId') sectionId: string,
    @CurrentUser('user_id') user_id: string,
  ): Promise<any> {
    return this.sectionsService.UpdateSection({
      ...data,
      sectionId,
      user_id,
    });
  }

  @Delete('/:sectionId/delete')
  async DeleteSection(
    @Param('sectionId') sectionId: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    await this.sectionsService.DeleteSection({
      sectionId: sectionId,
      user_id,
    });

    return {
      hasError: false,
      message: 'Seção deletada',
    };
  }
}
