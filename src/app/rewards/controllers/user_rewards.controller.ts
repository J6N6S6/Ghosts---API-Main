import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { RewardsService } from '../services/rewards.service';
import { ClaimRewardBody } from '../validators/ClaimReward.body';

@Controller('@me/rewards')
export class UserRewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  async listUserRewards(@CurrentUser('user_id') user_id: string) {
    const rewards = await this.rewardsService.getUserRewards(user_id);

    return {
      hasError: false,
      data: rewards,
    };
  }

  @Get('progress')
  async getProgress(@CurrentUser('user_id') user_id: string) {
    const progress = await this.rewardsService.getUserRewardProgress(user_id);

    return {
      hasError: false,
      data: progress,
    };
  }

  @Post('claim')
  async claimReward(
    @CurrentUser('user_id') user_id: string,
    @Body() body: ClaimRewardBody,
  ) {
    await this.rewardsService.claimReward({
      user_id,
      reward_id: body.reward_id,
      delivery_data: body.delivery_data,
    });

    return {
      hasError: false,
      message: 'Seu pedido foi registrado!',
    };
  }
}
