import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';
import { SendPushCutWebhookDTO } from '../../dtos/SendPushCutWebhook.dto';
import { SendPushCutWebHookCase } from './useCase/send-push-cut-webhook/update_push_cut_credentials.case';
import { UpdatePushCutCredentialsDTO } from './useCase/update-push-cut-credentials/update_push_cut_credentials.dto';
import { UpdatePushCutCredentialsCase } from './useCase/update-push-cut-credentials/update_push_cut_credentials.case';

@Injectable()
export class PushCutService {
  constructor(
    private readonly sendPushCutWebHookCase: SendPushCutWebHookCase,
    private readonly updatePushCutCredentialsCase: UpdatePushCutCredentialsCase,
  ) {}

  @OnEvent('integrations.pushcut')
  async sendToPushCutWebHook(data: SendPushCutWebhookDTO) {
    return this.sendPushCutWebHookCase.execute(data);
  }

  async updatePushCutCredentials(data: UpdatePushCutCredentialsDTO) {
    return this.updatePushCutCredentialsCase.execute(data);
  }
}
