import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IsAdmin } from '../../auth/decorators/endpoint-admin.decorator';
import { HttpResponse } from '@/shared/@types/HttpResponse';
import { WarnService } from '../services/warns.service';
import { CreateWarnDTO } from '../dtos/CreateWarnDTO';
import { UpdateWarnDTO } from '../dtos/UpdateWarnDTO';

@Controller()
export class WarnsController {
  constructor(private readonly warnsService: WarnService) {}

  @Post('@admin/warn')
  @IsAdmin()
  async createWarn(@Body() body: CreateWarnDTO): Promise<
    HttpResponse<{
      title: string;
      description?: string;
      status: 'CRITICAL' | 'LOW';
      created_by: string;
    }>
  > {
    const warn = await this.warnsService.createWarn(body);

    return {
      hasError: false,
      data: warn,
    };
  }

  @Delete('@admin/warn/:id')
  @IsAdmin()
  async deleteWarn(@Param('id') id: string): Promise<
    HttpResponse<{
      message: string;
    }>
  > {
    const warn = await this.findWarnById(id);

    if (!warn) {
      throw new NotFoundException('Warn not found');
    }

    await this.warnsService.deleteWarn(id);

    return {
      hasError: false,
      message: 'Excluído com sucesso!',
    };
  }

  @Patch('@admin/warn:/id')
  @IsAdmin()
  async updateWarn(
    @Param('id') id: string,
    @Body() body: UpdateWarnDTO,
  ): Promise<
    HttpResponse<{
      title: string;
      description?: string;
      status: 'CRITICAL' | 'LOW';
      created_by: string;
    }>
  > {
    const warn = await this.warnsService.updateWarn({ id, ...body } as any);

    if (!warn) {
      throw new NotFoundException('Warn not found');
    }

    return {
      hasError: false,
      data: warn,
    };
  }

  @Get('@admin/warn/:id')
  @IsAdmin()
  async findWarnById(@Param('id') id: string): Promise<
    HttpResponse<{
      title: string;
      description?: string;
      status: 'CRITICAL' | 'LOW';
      created_by: string;
    }>
  > {
    const warn = await this.warnsService.findWarnById(id);

    if (!warn) {
      throw new NotFoundException('Warn not found');
    }

    return {
      hasError: false,
      data: warn,
    };
  }

  @Get('@admin/warn')
  @IsAdmin()
  async findAllWarns(): Promise<
    HttpResponse<{
      title: string;
      description?: string;
      status: 'CRITICAL' | 'LOW';
      created_by: string;
    }>
  > {
    const warns = await this.warnsService.findAllWarns();

    return {
      hasError: false,
      data: warns,
    };
  }

  @Get('warns')
  async findAllWarnsWithoutUser(): Promise<
    HttpResponse<{
      title: string;
      description?: string;
      status: 'CRITICAL' | 'LOW';
      created_by: string;
    }>
  > {
    const warns = await this.warnsService.findAllWarns();

    const warnsWithoutUser = warns.map((warn) => {
      const { user, ...rest } = warn;
      return rest;
    });

    return {
      hasError: false,
      data: warnsWithoutUser,
    };
  }
}
