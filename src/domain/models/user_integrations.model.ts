import { UserIntegrationsEntity } from './../../infra/database/entities/user_integrations.entity';
import { UserRewards } from '@/infra/database/entities/user_rewards.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class UserIntegrationsModel {
  private _id: string;
  private _props: UserIntegrationsEntity;

  constructor(props: UserIntegrationsEntity) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  set push_cut(value: {
    authorized_transaction_webhook_url: string;
    pending_transaction_webhook_url: string;
  }) {
    this._props.push_cut = value;
  }

  get push_cut(): {
    authorized_transaction_webhook_url: string;
    pending_transaction_webhook_url: string;
  } {
    return this._props.push_cut;
  }

  set utmfy(value: { api_token: string }) {
    this._props.utmfy = value;
  }

  get utmfy(): {
    api_token: string;
  } {
    return this._props.utmfy;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get createdAt(): Date | null {
    return this._props.createdAt;
  }

  set createdAt(value: Date) {
    this._props.createdAt = value;
  }

  get allProps(): UserIntegrationsEntity {
    return { ...this._props, id: this._id };
  }
}
