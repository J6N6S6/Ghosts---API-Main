import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ModulesService } from '../services/modules.service';
import { CreateModuleBody } from '../validators/createModule.body';
import { EditModulesPositionBody } from '../validators/editModulesPosition.body';

@Controller('/products/:product_id/modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get('/')
  async ListProductModules(@Param('product_id') product_id: string) {
    const modules = await this.modulesService.ListProductModules(product_id);

    return {
      hasError: false,
      data: modules,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateModuleBody,
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    await this.modulesService.create({
      ...data,
      product_id,
      owner_id: user_id,
      image: file?.buffer || null,
    });

    return {
      hasError: false,
      message: 'Módulo criado',
    };
  }

  @Put('/:module_id')
  @UseInterceptors(FileInterceptor('image'))
  async UpdateProductModule(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateModuleBody,
    @Param('module_id') module_id: string,
    @CurrentUser('user_id') user_id: string,
  ): Promise<any> {
    await this.modulesService.edit({
      ...data,
      image: file?.buffer || null,
      module_id,
      owner_id: user_id,
    });

    return {
      hasError: false,
      message: 'Módulo atualizado',
    };
  }

  @Patch('/:module_id/position')
  async UpdateModulePosition(
    @Body('position') position: number,
    @Param('module_id') module_id: string,
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ): Promise<any> {
    await this.modulesService.updateModulePosition({
      module_id,
      position,
      user_id,
      product_id,
    });

    return {
      hasError: false,
      message: 'Ordem dos módulos atualizada',
    };
  }

  @Patch('/positions')
  async UpdateModulesPosition(
    @Body() data: EditModulesPositionBody,
    @CurrentUser('user_id') user_id: string,
  ): Promise<any> {
    await this.modulesService.updateAllModulesPosition({
      owner_id: user_id,
      modules: data.modules,
    });

    return {
      hasError: false,
      message: 'Posição dos modulos atualizado com sucesso',
    };
  }

  @Delete('/:module_id')
  async DeleteProductModule(
    @Param('module_id') module_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    await this.modulesService.deleteProductModule({
      module_id,
      owner_id: user_id,
    });

    return {
      hasError: false,
      message: 'Módulo deletado',
    };
  }
}
