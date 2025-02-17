import { UserReward } from '@/domain/models/user_rewards.model';
import { UserRewards } from '@/infra/database/entities/user_rewards.entity';
import { FindManyOptions } from 'typeorm';

export abstract class UserRewardsRepository {
  abstract create(data: UserReward): Promise<void>;
  abstract update(data: UserReward): Promise<void>;
  abstract findById(id: UserReward['id']): Promise<UserRewards>;
  abstract findByUserIdAndRewardId(
    user_id: string,
    reward_id: string,
  ): Promise<UserRewards>;
  abstract findAllByUserId(
    user_id: UserReward['user_id'],
  ): Promise<UserRewards[]>;
  abstract find(options?: FindManyOptions<UserRewards>): Promise<UserRewards[]>;
}
