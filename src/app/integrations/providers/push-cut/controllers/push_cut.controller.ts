import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { PushCutService } from '../pushcut.service';
import { UpdatePushCutCredentialsBody } from '../validators/updatePushCutCredentials';

@Controller('@me/integrations')
export class PushCutController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly pushCutService: PushCutService,
  ) {}

  @Put('/pushcut')
  async updatePushCutCredentials(
    @CurrentUser('user_id')
    user_id: string,
    @Body() body: UpdatePushCutCredentialsBody,
  ) {
    const result = await this.pushCutService.updatePushCutCredentials({
      ...body,
      user_id,
    });

    return {
      hasError: false,
      data: result,
    };
  }
}
