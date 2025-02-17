import { Module } from '@nestjs/common';
import { RewardsController } from './controllers/rewards.controller';
import { RewardsService } from './services/rewards.service';
import { InfraModule } from '@/infra/infra.module';
import { GetUserRewardsCase } from './useCases/get-user-rewards/get_user_rewards.case';
import { CreateRewardCase } from './useCases/create-reward/create_reward.case';
import { ListRewardsCase } from './useCases/list-rewards/list_rewards.case';
import { ClaimRewardCase } from './useCases/claim-reward/claim_reward.case';
import { CreateUserRewardCase } from './useCases/create-user-reward/create_user_reward.case';
import { VerifyUserRewardCase } from './useCases/verify-user-reward/verify_user_reward.case';
import { GetUserRewardProgressCase } from './useCases/get-user-reward-progress/get_user_reward_progress.case';
import { UserRewardsController } from './controllers/user_rewards.controller';
import { ListRewardsPendingAndDeliveredsCase } from './useCases/list-rewards-pendings-and-delivereds/list_rewards_pending_and_delivereds.case';
import { AdminRewardsController } from './controllers/admin.rewards.controller';
import { UpdateUserRewardStatusCase } from './useCases/update-user-reward-status/update_reward_status.case';

@Module({
  imports: [InfraModule],
  controllers: [
    RewardsController,
    UserRewardsController,
    AdminRewardsController,
  ],
  providers: [
    RewardsService,
    CreateRewardCase,
    ListRewardsCase,
    GetUserRewardsCase,
    ClaimRewardCase,
    CreateUserRewardCase,
    VerifyUserRewardCase,
    GetUserRewardProgressCase,
    ListRewardsPendingAndDeliveredsCase,
    UpdateUserRewardStatusCase,
  ],
  exports: [RewardsService],
})
export class RewardsModule {}
