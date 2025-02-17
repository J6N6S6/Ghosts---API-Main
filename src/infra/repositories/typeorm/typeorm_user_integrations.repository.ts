import { UserIntegrationsModel } from '@/domain/models/user_integrations.model';
import { UserReward } from '@/domain/models/user_rewards.model';
import { UserIntegrationsRepository } from '@/domain/repositories/user_integrations.repository';
import { UserRewardsRepository } from '@/domain/repositories/user_rewards.repository';
import { UserIntegrationsEntity } from '@/infra/database/entities/user_integrations.entity';
import { UserRewards } from '@/infra/database/entities/user_rewards.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormUserInegrationsRepository
  implements UserIntegrationsRepository
{
  constructor(
    @InjectRepository(UserIntegrationsEntity)
    private readonly userIntegrationsRepository: Repository<UserIntegrationsEntity>,
  ) {}

  async create(data: UserIntegrationsModel): Promise<void> {
    await this.userIntegrationsRepository.save(data.allProps);
  }

  async update(data: UserIntegrationsModel): Promise<void> {
    await this.userIntegrationsRepository.update(data.id, data.allProps);
  }

  findByUserId(user_id: string): Promise<UserIntegrationsEntity> {
    return this.userIntegrationsRepository.findOne({
      where: {
        user_id,
      },
    });
  }

  find(
    options?: FindManyOptions<UserIntegrationsEntity>,
  ): Promise<UserIntegrationsEntity[]> {
    return this.userIntegrationsRepository.find(options);
  }
}
