import { UserIntegrationsModel } from '@/domain/models/user_integrations.model';
import { IERefundRequestRepository } from '@/domain/repositories/refund_request';
import { UserIntegrationsRepository } from '@/domain/repositories/user_integrations.repository';
import { RefundRequestEntity } from '@/infra/database/entities';
import { Pagination } from '@/infra/utils/typeorm_pagination';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, ILike } from 'typeorm';

@Injectable()
export class GetIntegrationsCase {
  constructor(
    private readonly userIntegrationsRepository: UserIntegrationsRepository,
  ) {}

  async execute(user_id: string) {
    const integrations = await this.userIntegrationsRepository.findByUserId(
      user_id,
    );

    if (!integrations) {
      await this.userIntegrationsRepository.create(
        new UserIntegrationsModel({
          user_id,
          push_cut: null,
          utmfy: null,
        }),
      );

      const integrations = await this.userIntegrationsRepository.findByUserId(
        user_id,
      );

      console.log('integrations created: ', integrations);

      return integrations;
    }

    return integrations;
  }
}
