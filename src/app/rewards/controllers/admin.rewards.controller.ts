import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { RewardsService } from '../services/rewards.service';
import { ClaimRewardBody } from '../validators/ClaimReward.body';
import { IsAdmin } from '@/app/auth/decorators/endpoint-admin.decorator';
import { ListRewardPendingAndDeliveredDTO } from '../useCases/list-rewards-pendings-and-delivereds/list_rewards_pending_and_delivereds.dto';
import { UpdateUserRewardStatusBody } from '../validators/UpdateUserRewardStatusBody';

@Controller('@admin/rewards')
export class AdminRewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  @IsAdmin()
  async listUserRewards(
    @Query('status') status: ListRewardPendingAndDeliveredDTO['status'],
  ) {
    const rewards = await this.rewardsService.listRewardPendingAndDelivereds({
      status,
    });

    return {
      hasError: false,
      data: rewards,
    };
  }

  @Patch('/update/:user_reward_id')
  @IsAdmin()
  async updateUserReward(
    @Param('user_reward_id') user_reward_id: string,
    @Body() body: UpdateUserRewardStatusBody,
  ) {
    const rewards = await this.rewardsService.updateUserRewardStatus({
      user_reward_id,
      status: body.status,
    });

    return {
      hasError: false,
      data: 'Recompensa do usuário atualizada com sucesso.',
    };
  }
}
