import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IntegrationsService } from '../services/integrations.service';
import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { UpdatePushCutCredentialsBody } from '../providers/push-cut/validators/updatePushCutCredentials';

@Controller('@me/integrations')
export class IntegrationsController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly integrationsService: IntegrationsService,
  ) {}
  @Get()
  async getIntegrations(
    @CurrentUser('user_id')
    user_id: string,
  ) {
    const result = await this.integrationsService.getIntegrations(user_id);

    return {
      hasError: false,
      data: result,
    };
  }
}
