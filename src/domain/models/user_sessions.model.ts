import { UserSessions } from '@/infra/database/entities';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class UserSession {
  private _id: string;
  private _props: UserSessions;

  constructor(props: UserSessions) {
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

  get device_name(): string {
    return this._props.device_name;
  }

  get device_type(): string {
    return this._props.device_type;
  }

  get session_origin(): string {
    return this._props.session_origin;
  }

  get ip_address(): string {
    return this._props.ip_address;
  }

  get token(): string {
    return this._props.token;
  }

  set token(value: string) {
    this._props.token = value;
  }

  get token_expires(): Date {
    return this._props.token_expires;
  }

  set token_expires(value: Date) {
    this._props.token_expires = value;
  }

  get refresh_token(): string {
    return this._props.refresh_token;
  }

  set refresh_token(value: string) {
    this._props.refresh_token = value;
  }

  get refresh_token_expires(): Date {
    return this._props.refresh_token_expires;
  }

  set refresh_token_expires(value: Date) {
    this._props.refresh_token_expires = value;
  }

  get last_activity(): Date {
    return this._props.last_activity;
  }

  set last_activity(value: Date) {
    this._props.last_activity = value;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get allProps(): UserSessions {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
