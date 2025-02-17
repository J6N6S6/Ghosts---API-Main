export interface UpdateUserRewardStatusDTO {
  status: 'pending_delivery' | 'delivered';
  user_reward_id: string;
}
