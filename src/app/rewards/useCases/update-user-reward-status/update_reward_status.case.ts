import { UserRewardsRepository } from '@/domain/repositories/user_rewards.repository';
import { Injectable } from '@nestjs/common';
import { UpdateUserRewardStatusDTO } from './update_user_reward_status.dto';
import { UserReward } from '@/domain/models/user_rewards.model';

@Injectable()
export class UpdateUserRewardStatusCase {
  constructor(private readonly userRewardsRepository: UserRewardsRepository) {}

  async execute({ status, user_reward_id }: UpdateUserRewardStatusDTO) {
    const user_reward = await this.userRewardsRepository.findById(
      user_reward_id,
    );

    const newUserRewardModeled = new UserReward(user_reward);
    newUserRewardModeled.status = status;
    await this.userRewardsRepository.update(newUserRewardModeled);
  }
}
