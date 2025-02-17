import { UserResetPasswords } from '@/infra/database/entities';
import { GenerateUUID } from '@/infra/services/generateUUID';

export class UserResetPassword {
  private _id: string;
  private _props: UserResetPasswords;

  constructor(props: UserResetPasswords) {
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

  get code(): string {
    return this._props.code;
  }

  get expires(): Date {
    return this._props.expires;
  }

  get used(): boolean {
    return this._props.used;
  }

  set used(value: boolean) {
    this._props.used = value;
  }

  get ip_address(): string {
    return this._props.ip_address;
  }

  get user_agent(): string {
    return this._props.user_agent;
  }

  get left_attempts(): number {
    return this._props.left_attempts;
  }

  set left_attempts(value: number) {
    this._props.left_attempts = value;
  }

  get blocked_until(): Date {
    return this._props.blocked_until;
  }

  set blocked_until(value: Date) {
    this._props.blocked_until = value;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get allProps(): UserResetPasswords {
    return {
      ...this._props,
      id: this._id,
    };
  }
}
