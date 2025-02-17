import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { UpdateUtmfyCredentialsBody } from '../valitadors/updateUtmfyCredentials';
import { UtmfyService } from '../utmfy.service';

@Controller('@me/integrations')
export class UtmfyController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly utmfyService: UtmfyService,
  ) {}

  @Put('/utmfy')
  async updatePushCutCredentials(
    @CurrentUser('user_id')
    user_id: string,
    @Body() body: UpdateUtmfyCredentialsBody,
  ) {
    const result = await this.utmfyService.updateUtmfyCredentials({
      ...body,
      user_id,
    });

    return {
      hasError: false,
      data: result,
    };
  }
}
