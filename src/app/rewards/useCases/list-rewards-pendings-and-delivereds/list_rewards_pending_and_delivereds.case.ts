import { UserRewardsRepository } from '@/domain/repositories/user_rewards.repository';
import { Injectable } from '@nestjs/common';
import { ListRewardPendingAndDeliveredDTO } from './list_rewards_pending_and_delivereds.dto';

@Injectable()
export class ListRewardsPendingAndDeliveredsCase {
  constructor(private readonly userRewardsRepository: UserRewardsRepository) {}

  async execute({ status }: ListRewardPendingAndDeliveredDTO) {
    const userRewards = await this.userRewardsRepository.find({
      where: {
        status,
      },
      relations: ['reward', 'user'],
      select: {
        user:{
          id: true,
         name: true,
         email: true,
         phone: true,
         total_revenue: true

        }
      }
    });

    return userRewards;
  }
}
