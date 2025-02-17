import { UserReward } from '@/domain/models/user_rewards.model';
import { UserIntegrationsEntity } from '@/infra/database/entities/user_integrations.entity';
import { UserRewards } from '@/infra/database/entities/user_rewards.entity';
import { FindManyOptions } from 'typeorm';
import { UserIntegrationsModel } from '../models/user_integrations.model';

export abstract class UserIntegrationsRepository {
  abstract create(data: UserIntegrationsModel): Promise<void>;
  abstract update(data: UserIntegrationsModel): Promise<void>;
  abstract findByUserId(user_id: string): Promise<UserIntegrationsEntity>;

  abstract find(
    options?: FindManyOptions<UserIntegrationsEntity>,
  ): Promise<UserIntegrationsEntity[]>;
}
