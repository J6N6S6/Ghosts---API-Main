import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { Injectable } from '@nestjs/common';
import { UserIntegrationsRepository } from '@/domain/repositories/user_integrations.repository';
import { ServerException } from '@/infra/exception/server.exception';
import { UserIntegrationsModel } from '@/domain/models/user_integrations.model';
import { UpdateUtmfyCredentialsDTO } from './update_credentials.dto';

@Injectable()
export class UpdateUtmfyCredentialsCase {
  constructor(
    private readonly userIntegrationsRepository: UserIntegrationsRepository,
  ) {}

  async execute({ user_id, api_token }: UpdateUtmfyCredentialsDTO) {
    const integrations = await this.userIntegrationsRepository.findByUserId(
      user_id,
    );

    if (!integrations) {
      return '';
    }
    const updatedIntegrations = new UserIntegrationsModel({
      ...integrations,
      utmfy: {
        api_token,
      },
    });

    await this.userIntegrationsRepository.update(updatedIntegrations);

    return {
      message: 'Utmfy credentials updated',
    };
  }
}
