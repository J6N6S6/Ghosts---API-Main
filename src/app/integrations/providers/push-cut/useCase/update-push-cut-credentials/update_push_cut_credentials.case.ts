import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { Injectable } from '@nestjs/common';
import { UpdatePushCutCredentialsDTO } from './update_push_cut_credentials.dto';
import { UserIntegrationsRepository } from '@/domain/repositories/user_integrations.repository';
import { ServerException } from '@/infra/exception/server.exception';
import { UserIntegrationsModel } from '@/domain/models/user_integrations.model';

@Injectable()
export class UpdatePushCutCredentialsCase {
  constructor(
    private readonly userIntegrationsRepository: UserIntegrationsRepository,
  ) {}

  async execute({
    user_id,
    authorized_transaction_webhook_url,
    pending_transaction_webhook_url,
  }: UpdatePushCutCredentialsDTO) {
    const integrations = await this.userIntegrationsRepository.findByUserId(
      user_id,
    );

    if (!integrations) {
      return;
    }
    const updatedIntegrations = new UserIntegrationsModel({
      ...integrations,
      push_cut: {
        authorized_transaction_webhook_url,
        pending_transaction_webhook_url,
      },
    });

    await this.userIntegrationsRepository.update(updatedIntegrations);

    return {
      message: 'Push Cut credentials updated',
    };
  }
}
