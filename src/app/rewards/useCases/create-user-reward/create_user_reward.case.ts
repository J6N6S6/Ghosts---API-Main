import { UserRewardsRepository } from '@/domain/repositories/user_rewards.repository';
import { Injectable } from '@nestjs/common';
import { CreateUserRewardDTO } from './create_user_reward.dto';
import { UserReward } from '@/domain/models/user_rewards.model';

@Injectable()
export class CreateUserRewardCase {
  constructor(private readonly userRewardsRepository: UserRewardsRepository) {}

  async execute(data: CreateUserRewardDTO) {
    const userReward = await this.userRewardsRepository.findByUserIdAndRewardId(
      data.user_id,
      data.reward_id,
    );

    if (userReward) return;

    const reward = new UserReward({
      reward_id: data.reward_id,
      user_id: data.user_id,
      status: 'pending',
      claimed: false,
    });

    await this.userRewardsRepository.create(reward);

    // TODO: create service to send email to user warning to reward available

    return;
  }
}
