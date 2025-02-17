import { UserRewardsRepository } from '@/domain/repositories/user_rewards.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserRewardsCase {
  constructor(private readonly userRewardsRepository: UserRewardsRepository) {}

  async execute(user_id: string) {
    const userRewards = await this.userRewardsRepository.find({
      where: {
        user_id,
      },
      relations: ['reward'],
    });

    return userRewards;
  }
}
