import { UserReward } from '@/domain/models/user_rewards.model';
import { UserRewardsRepository } from '@/domain/repositories/user_rewards.repository';
import { UserRewards } from '@/infra/database/entities/user_rewards.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormUserRewardsRepository implements UserRewardsRepository {
  constructor(
    @InjectRepository(UserRewards)
    private readonly userRewardsRepository: Repository<UserRewards>,
  ) {}

  async create(data: UserReward): Promise<void> {
    await this.userRewardsRepository.save(data.allProps);
  }

  async update(data: UserReward): Promise<void> {
    await this.userRewardsRepository.update(data.id, data.allProps);
  }

  findById(id: string): Promise<UserRewards> {
    return this.userRewardsRepository.findOne({
      where: {
        id,
      },
    });
  }

  findByUserIdAndRewardId(
    user_id: string,
    reward_id: string,
  ): Promise<UserRewards> {
    return this.userRewardsRepository.findOne({
      where: {
        user_id,
        reward_id,
      },
    });
  }

  findAllByUserId(user_id: string): Promise<UserRewards[]> {
    return this.userRewardsRepository.find({
      where: {
        user_id,
      },
    });
  }

  find(options?: FindManyOptions<UserRewards>): Promise<UserRewards[]> {
    return this.userRewardsRepository.find(options);
  }
}
