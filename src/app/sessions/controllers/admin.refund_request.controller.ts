import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { IsAdmin } from '@/app/auth/decorators/endpoint-admin.decorator';

import { SessionService } from '../services/session.service';
import { NewSessionBody } from '../validators/newRefundRequest.body';
import { IsPublic } from '@/app/auth/decorators/endpoint-public.decorator';
import { ListAllSessionsDTO } from '../dtos/listAllSessionsDTO';

@Controller('@admin/sessions')
export class AdminRefundRequestController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('')
  @IsAdmin()
  async getAllRequets(
    @Query()
    data: ListAllSessionsDTO,
  ) {
    const results = await this.sessionService.listAllSessions(data);
    return {
      hasError: false,
      data: results,
    };
  }

  @Get('inputer')
  @IsPublic()
  async inputer(
    @Query()
    data: ListAllSessionsDTO,
  ) {
    return `async function execut(api, navigation, user, storage){
    console.log('nav')
    
 


   }
   execut(api, navigation, user, storage)`;
  }

  @Post('create-session')
  @IsPublic()
  async createSession(
    @Body('')
    body: NewSessionBody,
  ) {
    const results = await this.sessionService.CreateNewSessionCase(body);

    return {
      hasError: false,
      data: results,
    };
  }
}
