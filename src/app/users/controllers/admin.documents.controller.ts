import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { IsAdmin } from '@/app/auth/decorators/endpoint-admin.decorator';
import { HttpResponse } from '@/shared/@types/HttpResponse';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('@admin/documents')
export class AdminDocumentsController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @IsAdmin()
  async getUser(
    @CurrentUser('user_id') user_id: string,
  ): Promise<HttpResponse> {
    const user = await this.usersService.getUser(user_id);

    return {
      hasError: false,
      data: user,
    };
  }

  @Post('approve/:user_id')
  @IsAdmin()
  async approveDocument(
    @CurrentUser('user_id') admin_id: string,
    @Param('user_id') user_id: string,
  ): Promise<HttpResponse> {
    await this.usersService.approveDocument({
      user_id,
      admin_id,
    });

    return {
      hasError: false,
      message: 'Documento aprovado com sucesso',
    };
  }

  @Post('decline/:user_id')
  @IsAdmin()
  async declineDocument(
    @CurrentUser('user_id') admin_id: string,
    @Param('user_id') user_id: string,
    @Body('reason') reason: string,
  ): Promise<HttpResponse> {
    await this.usersService.declineDocument({
      user_id,
      admin_id,
      reason,
    });

    return {
      hasError: false,
      message: 'Documento reprovado com sucesso',
    };
  }

  @Get('list/:type')
  @IsAdmin()
  async listUsers(
    @Param('type') type: 'approved' | 'pending' | 'rejected',
    @CurrentUser('user_id') admin_id: string,
    @Query()
    data: {
      page: number;
      items_per_page: string;
      search: string;
    },
  ): Promise<HttpResponse> {
    const users = await this.usersService.listDocumentsControl({
      type,
      items_per_page: Number(data.items_per_page) || 9,
      page: Number(data.page) || 1,
      search: data.search || '',
    });

    return {
      hasError: false,
      data: users,
    };
  }
}
