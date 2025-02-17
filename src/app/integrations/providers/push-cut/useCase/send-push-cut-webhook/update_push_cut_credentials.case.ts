import { Injectable } from '@nestjs/common';
import { UserIntegrationsRepository } from '@/domain/repositories/user_integrations.repository';

import { ClientException } from '@/infra/exception/client.exception';
import { HttpService } from '@nestjs/axios';
import { SendPushCutWebhookDTO } from '@/app/integrations/dtos/SendPushCutWebhook.dto';

@Injectable()
export class SendPushCutWebHookCase {
  constructor(
    private readonly userIntegrationsRepository: UserIntegrationsRepository,
    private readonly httpService: HttpService,
  ) {}

  async execute({ user_id, notification_type }: SendPushCutWebhookDTO) {
    const integrations = await this.userIntegrationsRepository.findByUserId(
      user_id,
    );

    if (!integrations) {
      return;
    }
    const push_cut_webhooks = integrations.push_cut;

    if (notification_type === 'MOBILE_GENERATED_PIX_AND_BANK_SLIP') {
      await this.httpService.axiosRef.post(
        `${push_cut_webhooks.pending_transaction_webhook_url}`,
      );
    }

    if (notification_type === 'MOBILE_APPROVED_SALES') {
      await this.httpService.axiosRef.post(
        `${push_cut_webhooks.authorized_transaction_webhook_url}`,
      );
    }
  }
}
