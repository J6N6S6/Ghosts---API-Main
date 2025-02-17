import { RewardsRepository } from '@/domain/repositories/rewards.repository';
import { UserRewardsRepository } from '@/domain/repositories/user_rewards.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import { VerifyUserRewardCase } from '../verify-user-reward/verify_user_reward.case';
import { In } from 'typeorm';

@Injectable()
export class GetUserRewardProgressCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userRewardsRepository: UserRewardsRepository,
    private readonly rewardsRepository: RewardsRepository,
    private readonly verifyUserRewardCase: VerifyUserRewardCase,
  ) {}

  async execute(user_id: string) {
    await this.verifyUserRewardCase.execute(user_id);

    const [user, userRewards, rewards] = await Promise.all([
      this.usersRepository.findById(user_id),
      this.userRewardsRepository.find({
        where: {
          user_id,
          claimed: false,
          status: In(['pending', 'pending_delivery']),
        },
        relations: ['reward'],
      }),
      this.rewardsRepository.find({
        order: {
          goal: 'ASC',
        },
      }),
    ]);

    const userGoal = user?.total_revenue || 0;

    const rewardsIfNotReceived = rewards.filter(
      (reward) =>
        !userRewards.find((userReward) => userReward.reward_id === reward.id),
    );

    const nextReward = rewardsIfNotReceived.find(
      (reward) => reward.goal > userGoal,
    );

    if (!nextReward)
      return {
        next_reward: null,
        next_reward_percentage: 100,
        rewards_available: [],
      };

    return {
      next_reward: {
        id: nextReward.id,
        title: nextReward.title,
        description: nextReward.description,
        goal: nextReward.goal,
        value: Number(userGoal.toFixed(2)),
        progress: Number(
          Math.round((userGoal / nextReward.goal) * 100).toFixed(2),
        ),
        image: nextReward.image,
      },
      rewards_available_to_claim: userRewards,
      rewards_available: rewardsIfNotReceived
        .filter((r) => r.id !== nextReward.id)
        .map((reward) => {
          return {
            id: reward.id,
            title: reward.title,
            description: reward.description,
            goal: reward.goal,
            value: userGoal,
            progress: Math.round((userGoal / reward.goal) * 100).toFixed(2),
            image: reward.image,
          };
        }),
    };
  }
}
