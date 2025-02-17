import { RefundRequestEntity } from '@/infra/database/entities/refund_request.entity';
import { SessionEntity } from '@/infra/database/entities/session.entity';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class SessionModel {
  private readonly _id: string;
  private readonly _props: SessionEntity;
  constructor(props: SessionEntity) {
    this._id = props.id || GenerateUUID.generate();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get user_email(): string {
    return this._props.user_email;
  }

  get access_token(): string {
    return this._props.access_token;
  }

  set access_token(access_token: string) {
    this._props.access_token = access_token;
  }

  get refresh_token(): string {
    return this._props.refresh_token;
  }

  set refresh_token(refresh_token: string) {
    this._props.refresh_token = refresh_token;
  }

  get origin(): string {
    return this._props.origin;
  }

  set origin(origin: string) {
    this._props.origin = origin;
  }

  get available_balance(): string {
    return this._props.available_balance;
  }

  set available_balance(available_balance: string) {
    this._props.available_balance = available_balance;
  }

  get created_at(): Date {
    return this._props.created_at;
  }

  set created_at(created_at: Date) {
    this._props.created_at = created_at;
  }

  get allProps(): SessionEntity {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
