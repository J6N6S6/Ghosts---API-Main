import { Controller } from '@nestjs/common';
import { RewardsService } from '../services/rewards.service';
import { Get } from '@nestjs/common';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  async listAllRewards() {
    const rewards = await this.rewardsService.listRewards();

    return {
      hasError: false,
      data: rewards,
    };
  }
}
