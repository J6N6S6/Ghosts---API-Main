import { UpdateUtmfyCredentialsDTO } from './useCases/update-credentials/update_credentials.dto';
import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';
import { UpdateUtmfyCredentialsCase } from './useCases/update-credentials/update_credentials.case';
import { CreateOrderDTO } from './useCases/create-order/create-order.dto';
import { CreateUtmfyOrderCase } from './useCases/create-order/create-order.case';

@Injectable()
export class UtmfyService {
  constructor(
    private readonly updateUtmfyCredentialsCase: UpdateUtmfyCredentialsCase,
    private readonly createUtmfyOrderCase: CreateUtmfyOrderCase,
  ) {}

  async updateUtmfyCredentials(data: UpdateUtmfyCredentialsDTO) {
    return this.updateUtmfyCredentialsCase.execute(data);
  }

  @OnEvent('integrations.utmfy')
  async sendTransactionToUtmfy(data: CreateOrderDTO) {
    return await this.createUtmfyOrderCase.execute(data);
  }
}
