import { ClientException } from '@/infra/exception/client.exception';
import { UserRewardsRepository } from '@/domain/repositories/user_rewards.repository';
import { Injectable } from '@nestjs/common';
import { ClaimRewardDTO } from './claim_reward.dto';
import { UserReward } from '@/domain/models/user_rewards.model';

@Injectable()
export class ClaimRewardCase {
  constructor(private readonly userRewardsRepository: UserRewardsRepository) {}

  async execute({ reward_id, user_id, delivery_data }: ClaimRewardDTO) {
    const userRewards = await this.userRewardsRepository.find({
      where: {
        id: reward_id,
      },
      relations: ['reward'],
    });

    if (!userRewards.length || !userRewards[0]) {
      throw new ClientException('Você não possui essa recompensa.');
    }

    const userReward = new UserReward(userRewards[0]);

    userReward.claimed = true;
    userReward.claimedAt = new Date();
    userReward.status = 'pending_delivery';
    userReward.delivery_data = delivery_data;

    await this.userRewardsRepository.update(userReward);
  }
}
