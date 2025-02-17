import { UserRewards } from '@/infra/database/entities/user_rewards.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class UserReward {
  private _id: string;
  private _props: UserRewards;

  constructor(props: UserRewards) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get reward_id(): string {
    return this._props.reward_id;
  }

  set reward_id(value: string) {
    this._props.reward_id = value;
  }

  get claimed(): boolean {
    return this._props.claimed;
  }

  set claimed(value: boolean) {
    this._props.claimed = value;
  }

  get delivery_data(): any {
    return this._props.delivery_data;
  }

  set delivery_data(value: any) {
    this._props.delivery_data = value;
  }

  get status(): 'pending' | 'pending_delivery' | 'delivered' {
    return this._props.status;
  }

  set status(value: 'pending' | 'pending_delivery' | 'delivered') {
    this._props.status = value;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get claimedAt(): Date | null {
    return this._props.claimedAt;
  }

  set claimedAt(value: Date) {
    this._props.claimedAt = value;
  }

  get createdAt(): Date | null {
    return this._props.createdAt;
  }

  set createdAt(value: Date) {
    this._props.createdAt = value;
  }

  get allProps(): UserRewards {
    return { ...this._props, id: this._id };
  }
}
