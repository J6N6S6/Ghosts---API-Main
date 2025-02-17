import { Injectable } from '@nestjs/common';
import { GetIntegrationsCase } from '../useCases/get-integrations/get_integrations.case';
import { UpdatePushCutCredentialsCase } from '../providers/push-cut/useCase/update-push-cut-credentials/update_push_cut_credentials.case';
import { UpdatePushCutCredentialsDTO } from '../providers/push-cut/useCase/update-push-cut-credentials/update_push_cut_credentials.dto';

@Injectable()
export class IntegrationsService {
  constructor(private readonly getIntregationsCase: GetIntegrationsCase) {}

  async getIntegrations(user_id: string) {
    return this.getIntregationsCase.execute(user_id);
  }
}
