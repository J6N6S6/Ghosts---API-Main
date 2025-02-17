import { User } from '@/domain/models/users.model';
import { RewardsRepository } from '@/domain/repositories/rewards.repository';
import { UserRewardsRepository } from '@/domain/repositories/user_rewards.repository';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';
import * as datefns from 'date-fns';
import { Raw } from 'typeorm';
import { CreateUserRewardCase } from '../create-user-reward/create_user_reward.case';
@Injectable()
export class VerifyUserRewardCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userRewardsRepository: UserRewardsRepository,
    private readonly rewardsRepository: RewardsRepository,
    private readonly createUserRewardCase: CreateUserRewardCase,
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute(user_id: string) {
    const [user, userRewards, rewards] = await Promise.all([
      this.usersRepository.findById(user_id),
      this.userRewardsRepository.findAllByUserId(user_id),
      this.rewardsRepository.find({
        order: {
          goal: 'ASC',
        },
      }),
    ]);

    let userGoal = user?.total_revenue || 0;

    if (
      !user.last_revenue_update ||
      datefns.differenceInHours(new Date(), user.last_revenue_update) >= 1
    ) {
      const transactions = await this.transactionsRepository.findAll({
        where: {
          status: 'AUTHORIZED',
          split_accounts: Raw(
            () => `EXISTS (
              SELECT 1
              FROM jsonb_array_elements(split_accounts) AS x
              WHERE x->>'account_id' = '${user_id}' OR x->>'seller_id' = '${user_id}'
            )`,
          ),
        },
        select: {
          split_accounts: true,
        },
      });

      userGoal = 0;

      for (const transaction of transactions) {
        const splitedAccount = transaction.split_accounts.find(
          (splitAccount) => splitAccount.account_id === user_id,
        );

        if (!splitedAccount) continue;

        userGoal += splitedAccount.amount;
      }

      const userModel = new User(user);

      userModel.total_revenue = userGoal;
      userModel.last_revenue_update = new Date();

      await this.usersRepository.update(userModel);
    }

    const rewardsIfNotReceived = rewards.filter(
      (reward) =>
        !userRewards.find((userReward) => userReward.reward_id === reward.id),
    );

    for (const reward of rewardsIfNotReceived) {
      if (reward.goal <= userGoal) {
        await this.createUserRewardCase.execute({
          user_id,
          reward_id: reward.id,
        });
      }
    }
  }
}
