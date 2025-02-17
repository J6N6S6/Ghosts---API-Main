import { UpdateUserRewardStatusCase } from './../useCases/update-user-reward-status/update_reward_status.case';
import { Injectable } from '@nestjs/common';
import { GetUserRewardsCase } from '../useCases/get-user-rewards/get_user_rewards.case';
import { ClaimRewardCase } from '../useCases/claim-reward/claim_reward.case';
import { CreateUserRewardCase } from '../useCases/create-user-reward/create_user_reward.case';
import { GetUserRewardProgressCase } from '../useCases/get-user-reward-progress/get_user_reward_progress.case';
import { ListRewardsCase } from '../useCases/list-rewards/list_rewards.case';
import { CreateRewardCase } from '../useCases/create-reward/create_reward.case';
import { ClaimRewardDTO } from '../useCases/claim-reward/claim_reward.dto';
import { CreateUserRewardDTO } from '../useCases/create-user-reward/create_user_reward.dto';
import { CreateRewardDTO } from '../useCases/create-reward/create_reward.dto';
import { ListRewardPendingAndDeliveredDTO } from '../useCases/list-rewards-pendings-and-delivereds/list_rewards_pending_and_delivereds.dto';
import { ListRewardsPendingAndDeliveredsCase } from '../useCases/list-rewards-pendings-and-delivereds/list_rewards_pending_and_delivereds.case';
import { UpdateUserRewardStatusDTO } from '../useCases/update-user-reward-status/update_user_reward_status.dto';

@Injectable()
export class RewardsService {
  constructor(
    private readonly getUserRewardsCase: GetUserRewardsCase,
    private readonly claimRewardCase: ClaimRewardCase,
    private readonly createUserRewardCase: CreateUserRewardCase,
    private readonly getUserRewardProgressCase: GetUserRewardProgressCase,
    private readonly listRewardsCase: ListRewardsCase,
    private readonly verifyUserRewardCase: GetUserRewardProgressCase,
    private readonly createRewardCase: CreateRewardCase,
    private readonly listRewardPendingAndDeliveredCase: ListRewardsPendingAndDeliveredsCase,
    private readonly updateUserRewardStatusCase: UpdateUserRewardStatusCase,
  ) {}

  getUserRewards(user_id: string) {
    return this.getUserRewardsCase.execute(user_id);
  }

  claimReward(data: ClaimRewardDTO) {
    return this.claimRewardCase.execute(data);
  }

  createUserReward(data: CreateUserRewardDTO) {
    return this.createUserRewardCase.execute(data);
  }

  getUserRewardProgress(user_id: string) {
    return this.getUserRewardProgressCase.execute(user_id);
  }

  listRewards() {
    return this.listRewardsCase.execute();
  }

  verifyUserReward(user_id: string) {
    return this.verifyUserRewardCase.execute(user_id);
  }

  createReward(data: CreateRewardDTO) {
    return this.createRewardCase.execute(data);
  }

  listRewardPendingAndDelivereds(data: ListRewardPendingAndDeliveredDTO) {
    return this.listRewardPendingAndDeliveredCase.execute(data);
  }

  updateUserRewardStatus(data: UpdateUserRewardStatusDTO) {
    return this.updateUserRewardStatusCase.execute(data);
  }
}
