import { UsersActivity } from '@/infra/database/entities';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class UserActivity {
  private _id: string;
  private _props: UsersActivity;

  constructor(props: UsersActivity) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;

    if (!props.createdAt) {
      this._props.createdAt = new Date();
    }
  }

  get id(): string {
    return this._id;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  get activity_type(): string {
    return this._props.activity_type;
  }

  get session_id(): string {
    return this._props.session_id;
  }

  get ip_address(): string {
    return this._props.ip_address;
  }

  get activity(): string {
    return this._props.activity;
  }

  get metadata(): any {
    return this._props.metadata;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get allProps(): UsersActivity {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
