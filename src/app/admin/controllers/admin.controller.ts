import { ChangeAdquirentCase } from './../useCases/change-adquirent/change_adquirent.case';
import {
  Body,
  Controller,
  Get,
  Param,
  Headers,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminService } from '../services/admin.service';
import { IsAdmin } from '@/app/auth/decorators/endpoint-admin.decorator';
import { ChangeAdquirentBody } from '../validators/changeAdquirent.body';
import { CreateTaxeBody } from '../validators/createTaxe.body';
import { UpdateTaxeBody } from '../validators/updateTaxe.body';
import { GetAllUsersQueryDTO } from '../dtos/GetAllUsersQueryDTO';
import { UpdateUserTaxeBody } from '../validators/updateUserTaxe.body';
import { Request } from 'express';
import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';

@Controller('@admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ADQUIRENT ROUTES
  @Post('/change-adquirent')
  @IsAdmin()
  async changeAdquirent(@Body() Body: ChangeAdquirentBody) {
    const data = await this.adminService.changeAdquirent(Body);
    return {
      hasError: false,
      data: data,
    };
  }

  @Get('/current-adquirents')
  @IsAdmin()
  async getCurrentAdquirents() {
    const data = await this.adminService.getCurrentAdquirents();
    return {
      hasError: false,
      data: data,
    };
  }

  @Get('/availables-adquirents')
  @IsAdmin()
  async getAvailableAdquirents() {
    const data = await this.adminService.getAvailablesAdquirents();
    return {
      hasError: false,
      data: data,
    };
  }

  // TAXES ROUTES
  @Post('/create-taxe')
  @IsAdmin()
  async createTaxe(@Body() body: CreateTaxeBody) {
    const data = await this.adminService.createTaxe(body);
    return {
      hasError: false,
      data: data,
    };
  }

  @Put('/update-taxe/:id')
  @IsAdmin()
  async updateTaxe(@Body() body: UpdateTaxeBody, @Param('id') id: string) {
    const data = await this.adminService.updateTaxe({ ...body, id });
    return {
      hasError: false,
      data: data,
    };
  }

  @Get('/taxes')
  @IsAdmin()
  async getTaxes() {
    const data = await this.adminService.getTaxes();
    return {
      hasError: false,
      data: data,
    };
  }
  @Get('/taxes/:id')
  @IsAdmin()
  async getTaxe(@Param('id') taxeId: string) {
    const data = await this.adminService.getTaxe(taxeId);
    return {
      hasError: false,
      data: data,
    };
  }

  // USERS ROUTES
  @Get('/users')
  @IsAdmin()
  async getUser(@Query() query: GetAllUsersQueryDTO) {
    const data = await this.adminService.getUser({
      page: query?.page,
      items_per_page: query?.items_per_page,
      search: query?.search,
    });
    return {
      hasError: false,
      data: data,
    };
  }

  @Get('/users/login-as-user/:userId')
  @IsAdmin()
  async loginAsUser(
    @Param('userId') userId: string,
    @Req() request: Request,
    @Headers('user-agent') user_agent: string,
    @CurrentUser('user_id') currentUserId: string,
  ) {
    const ip_address =
      request.headers['x-forwarded-for'] || request.socket.remoteAddress;

    const data = await this.adminService.loginAsUser({
      user_id: userId,
      user_agent,
      ip_address: ip_address as string,
      login_by_user_id: currentUserId,
    });
    return {
      hasError: false,
      data: data,
    };
  }

  @Put('/users/user-taxe/:userId')
  @IsAdmin()
  async updateUserTaxe(
    @Param('userId') userId: string,
    @Body() body: UpdateUserTaxeBody,
  ) {
    const data = await this.adminService.updateUserTaxe({
      userId,
      taxe: body.taxe,
    });
    return {
      hasError: false,
      data: data,
    };
  }

  @Get('/users/user-balance/:userId')
  @IsAdmin()
  async getUserBalance(@Param('userId') userId: string) {
    const data = await this.adminService.getUserBalance(userId);
    return {
      hasError: false,
      data: data,
    };
  }

  @Get('/users/user-metrics/:userId')
  @IsAdmin()
  async getUserMetrics(@Param('userId') userId: string) {
    const data = await this.adminService.getUserMetrics(userId);
    return {
      hasError: false,
      data: data,
    };
  }

  @Put('/users/toggle-status/:userId')
  @IsAdmin()
  async toggleUserStatus(@Param('userId') userId: string) {
    const data = await this.adminService.toggleUserStatus(userId);
    return {
      hasError: false,
      data: data,
    };
  }
}
